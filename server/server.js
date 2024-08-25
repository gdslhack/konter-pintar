const express = require('express');
const axios = require('axios');
const app = express();

const operatorPrefixes = {
    'Telkomsel': ['0811', '0812', '0813', '0821', '0822', '0852', '0853', '0823', '0851'],
    'Indosat': ['0814', '0815', '0816', '0855', '0856', '0857', '0858'],
    'XL': ['0817', '0818', '0819', '0859', '0877', '0878'],
    'Tri': ['0895', '0896', '0897', '0898', '0899'],
    'Smartfren': ['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888']
};

function getOperatorByPrefix(phoneNumber) {
    for (const [operator, prefixes] of Object.entries(operatorPrefixes)) {
        if (prefixes.some(prefix => phoneNumber.startsWith(prefix))) {
            return operator;
        }
    }
    return 'Unknown Operator';
}

async function fetchProductData() {
    const response = await axios.get('https://smartinkuota.otoreport.com/harga.js.php?id=1c8c62af3b9c9988fbde1297a58c93fb2daf0a46ff0046f2eb4a667b5f6a84424c8979bda21070b31e588dcbc750420b-8');
    const data = response.data;

    // Parsing HTML to extract table data
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    const tables = doc.querySelectorAll('table');

    const products = [];
    tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                products.push({
                    kode: cells[0].innerText.trim(),
                    keterangan: cells[1].innerText.trim(),
                    harga: cells[2].innerText.trim(),
                    status: cells[3].innerText.trim()
                });
            }
        });
    });

    return products;
}

async function getProductsByPhoneNumber(phoneNumber) {
    const operator = getOperatorByPrefix(phoneNumber);

    if (operator === 'Unknown Operator') {
        console.error('Unknown Operator');
        return [];
    }

    const products = await fetchProductData();
    const operatorProducts = products.filter(product => {
        return operatorPrefixes[operator].some(prefix => product.kode.startsWith(prefix));
    });

    return operatorProducts;
}

app.get('/api/products', async (req, res) => {
    const phoneNumber = req.query.phoneNumber || '';
    const products = await getProductsByPhoneNumber(phoneNumber);
    res.json(products);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
