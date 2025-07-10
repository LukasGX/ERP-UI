<?php
require __DIR__ . '/vendor/autoload.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class ERPServer implements MessageComponentInterface {
    protected $clients;
    protected $process;
    protected $pipes;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->startProcess();
    }

    protected function startProcess() {
        // Descriptor specification for process pipes
        $descriptorSpec = [
            0 => ["pipe", "r"],  // stdin
            1 => ["pipe", "w"],  // stdout
            2 => ["pipe", "w"]   // stderr
        ];

        $workingDirectory = __DIR__ . '/erp-v1.2.0 sp'; // Adjust to your ERP-Fix.exe directory
        $this->process = proc_open(
            'ERP-Fix.exe',
            $descriptorSpec,
            $this->pipes,
            $workingDirectory
        );

        if (!is_resource($this->process)) {
            throw new \RuntimeException("Failed to start ERP-Fix.exe");
        }

        // Set stdout and stderr to non-blocking
        stream_set_blocking($this->pipes[1], false);
        stream_set_blocking($this->pipes[2], false);

        // Read initial welcome message, if any
        $output = '';
        $timeoutMicroseconds = 2000000; // 2 seconds
        $startTime = microtime(true);

        while ((microtime(true) - $startTime) < ($timeoutMicroseconds / 1000000)) {
            $line = fgets($this->pipes[1]);
            if ($line === false) {
                usleep(10000); // Wait 10ms before next try
                continue;
            }
            echo "Received line: $line\n";
            $output .= $line;
            if (strpos($line, '<END-OF-OUTPUT>') !== false) {
                echo "End of output detected.\n";
                break;
            }
        }
        echo "Received after start: $output\n";

        // $line = fgets($this->pipes[1]);
        // if ($line !== false) {
        //     echo "Received after start: $line\n";
        // }
    }

    public function onOpen(ConnectionInterface $connection) {
        $this->clients->attach($connection);
    }

    public function onMessage(ConnectionInterface $from, $message) {
        // Write command to ERP-Fix.exe stdin
        if (is_resource($this->pipes[0])) {
            $bytesWritten = fwrite($this->pipes[0], $message . PHP_EOL);
            echo "Bytes written to stdin: $bytesWritten\n";
        } else {
            $from->send("Error: Input pipe is not available (process ended?).");
            return;
        }

        // Wait and read output with timeout (up to 2 seconds)
        $output = '';
        $timeoutMicroseconds = 2000000; // 2 seconds
        $startTime = microtime(true);

        while ((microtime(true) - $startTime) < ($timeoutMicroseconds / 1000000)) {
            $line = fgets($this->pipes[1]);
            if ($line === false) {
                usleep(10000); // Wait 10ms before next try
                continue;
            }
            echo "Received line: $line\n";
            $output .= $line;
            if (strpos($line, '<END-OF-OUTPUT>') !== false) {
                echo "End of output detected.\n";
                break;
            }
        }

        echo "Output from ERP-Fix.exe: $output\n";
        $from->send($output !== '' ? $output : '[No response from ERP-Fix.exe]');

        // Check if process is still running, restart if necessary
        if (!is_resource($this->pipes[0]) || !proc_get_status($this->process)['running']) {
            $from->send("Error: Process not available. Restarting...");
            $this->startProcess();
        }

        echo "Process running: " . ($status['running'] ? "yes" : "no") . "\n";
    }

    public function onClose(ConnectionInterface $connection) {
        $this->clients->detach($connection);
    }

    public function onError(ConnectionInterface $connection, \Exception $e) {
        $connection->close();
    }
}

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new ERPServer()
        )
    ),
    8080
);

echo "WebSocket Server running at ws://localhost:8080\n";
$server->run();
?>
