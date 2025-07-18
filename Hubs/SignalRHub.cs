using Microsoft.AspNetCore.SignalR;

namespace ERP_UI.Hubs
{
    public class SignalRHub : Hub
    {
        public async Task SendMessageToAll(string method, List<string> parameters)
        {
            // Bad code, I know

            var args = parameters?.Take(5).ToList() ?? new List<string>();

            switch (args.Count)
            {
                case 0:
                    await Clients.All.SendAsync(method);
                    break;
                case 1:
                    await Clients.All.SendAsync(method, args[0]);
                    break;
                case 2:
                    await Clients.All.SendAsync(method, args[0], args[1]);
                    break;
                case 3:
                    await Clients.All.SendAsync(method, args[0], args[1], args[2]);
                    break;
                case 4:
                    await Clients.All.SendAsync(method, args[0], args[1], args[2], args[3]);
                    break;
                case 5:
                    await Clients.All.SendAsync(method, args[0], args[1], args[2], args[3], args[4]);
                    break;
                default:
                    throw new ArgumentException("Zu viele Parameter angegeben. Maximal 5 erlaubt.");
            }
        }
    }
}
