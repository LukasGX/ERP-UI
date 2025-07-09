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

function showModal(content) {
    // Create a modal element
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="noModal()"><i class="fas fa-xmark"></i></span>
            ${content}
        </div>`;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    modal.style.transition = '0.5s ease';
    modal.classList.add('show');
}

function showPrices(priceId) {
    // fake data!
    const prices = [
        { article: 'A[0]', price: 100 }
    ];

    showModal(`
    <h2>Prices for ${priceId}</h2>
    <table>
        <tr>
            <th>Article</th>
            <th>Price</th>
        </tr>
        ${prices.map(p => `<tr><td>${p.article}</td><td>${p.price}</td></tr>`).join('')}
    </table>`);
}

function noModal() {
    const location = window.location.href;
    const newUrl = location.split('?')[0];
    window.location.href = newUrl;
}

function sortArticle(articleId) {
    showModal(`
    <h2>Sort Article</h2>
    <p>This functionality is not implemented yet.</p>`);
}

// creation functionalities
function newArticleType() {
    showModal(`
    <h2>Create New Article Type</h2>
    <p>This functionality is not implemented yet.</p>`);
}

function newArticle() {
    showModal(`
    <h2>Create New Article</h2>
    <p>This functionality is not implemented yet.</p>`);
}

function newStorageSlot() {
    showModal(`
    <h2>Create New Storage Slot</h2>
    <p>This functionality is not implemented yet.</p>`);
}

function newPriceList() {
    showModal(`
    <h2>Create New Price List</h2>
    <p>This functionality is not implemented yet.</p>`);
}

function newOrder() {
    showModal(`
    <h2>Create New Order</h2>
    <p>This functionality is not implemented yet.</p>`);
}

function newBill() {
    showModal(`
    <h2>Create New Bill</h2>
    <p>This functionality is not implemented yet.</p>`);
}

// ErrorModal
function errorModal(errorType) {
    let errorMessage = 'An unknown error occurred.';
    if (errorType === 'MISSING_ARTICLE') {
        errorMessage = 'Create at least one article.';
    }
    else  if (errorType === 'MISSING_ARTICLE_TYPE') {
        errorMessage = 'Create an article type.';
    }
    else if (errorType === 'MISSING_ORDER') {
        errorMessage = 'Create an order.';
    }
    showModal(`
    <h2>Error</h2>
    <p>${errorMessage}</p>`);
}