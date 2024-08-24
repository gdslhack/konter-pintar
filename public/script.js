document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            window.productData = data; // Simpan data produk di window untuk digunakan nanti
            populateProductOptions(data);
        })
        .catch(error => console.error('Error fetching products:', error));
});

function populateProductOptions(data) {
    const productSelect = document.getElementById('product');
    
    Object.keys(data).forEach(productType => {
        const option = document.createElement('option');
        option.value = productType;
        option.textContent = productType.toUpperCase();
        productSelect.appendChild(option);
    });

    handleProductChange();
}

document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const product = document.getElementById('product').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    let orderDetails = { product, phoneNumber };

    if (product === 'pln') {
        const denom = document.getElementById('denom').value;
        orderDetails.denom = denom;
    }

    fetch('/api/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
    })
    .then(response => response.json())
    .then(data => {
        alert('Pesanan Anda telah diterima!');
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function handleProductChange() {
    const product = document.getElementById('product').value;
    const plnOptions = document.getElementById('plnOptions');
    const phoneNumberInput = document.getElementById('phoneNumberInput');
    const productData = window.productData[product];

    if (product === 'pln') {
        populateDenomOptions(productData);
        plnOptions.style.display = 'block';
        phoneNumberInput.style.display = 'none';
    } else {
        plnOptions.style.display = 'none';
        phoneNumberInput.style.display = 'block';
    }
}

function populateDenomOptions(productData) {
    const denomSelect = document.getElementById('denom');
    denomSelect.innerHTML = ''; // Kosongkan opsi denom sebelumnya

    productData.forEach(item => {
        const option = document.createElement('option');
        option.value = item.denom; // Misalnya, ini adalah format denom
        option.textContent = `${item.denom}k - Rp ${item.harga}`; // Tampilkan denom dan harga
        denomSelect.appendChild(option);
    });
}
