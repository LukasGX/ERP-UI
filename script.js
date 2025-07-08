const urlParams = new URLSearchParams(window.location.search);
const priceShow = urlParams.get('prices');
if (priceShow) {
    showPrices(priceShow);
}

function highlight(highlight) {
    const entry = document.getElementById(highlight);
    if (entry) {
        entry.scrollIntoView({ behavior: 'smooth', block: 'center' });
        entry.style.transition = '0.5s ease';
        entry.classList.add('highlighted');
        setTimeout(() => {
            entry.classList.remove('highlighted');
        }, 3000);
    } else {
        console.warn(`Entry with ID ${highlight} not found.`);
    }
}

function showPrices(priceId) {
    // fake data!
    const prices = [
        { article: 'A[0]', price: 100 }
    ];

    // open modal to show prices
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="noPrices()"><i class="fas fa-xmark"></i></span>
            <h2>Prices for ${priceId}</h2>
            <table>
                <tr>
                    <th>Article</th>
                    <th>Price</th>
                </tr>
                ${prices.map(p => `<tr><td>${p.article}</td><td>${p.price}</td></tr>`).join('')}
            </table>
        </div>`;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    modal.style.transition = '0.5s ease';
    modal.classList.add('show');
}

function noPrices() {
    const location = window.location.href;
    const newUrl = location.split('?')[0];
    window.location.href = newUrl;
}