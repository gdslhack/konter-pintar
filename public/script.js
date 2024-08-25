document.getElementById('filterForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const phoneNumber = document.getElementById('phoneNumber').value;

    fetch(`/api/scrape?phoneNumber=${phoneNumber}`)
        .then(response => response.json())
        .then(products => {
            const tbody = document.getElementById('productTable').getElementsByTagName('tbody')[0];
            tbody.innerHTML = ''; // Bersihkan isi tabel

            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.kode}</td>
                    <td>${product.keterangan}</td>
                    <td>${product.harga}</td>
                    <td>${product.status}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});
