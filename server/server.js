const express = require('express');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const app = express();
const port = 3000;

const operatorPrefixes = {
    'Telkomsel': ['0811', '0812', '0813', '0821', '0822', '0852', '0853', '0823', '0851'],
    'Indosat': ['0814', '0815', '0816', '0855', '0856', '0857', '0858'],
    'XL': ['0817', '0818', '0819', '0859', '0877', '0878'],
    'Tri': ['0895', '0896', '0897', '0898', '0899'],
    'Smartfren': ['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888']
};

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/api/scrape', (req, res) => {
    fs.readFile(path.join(__dirname, '../public/harga.js.php'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read file' });
        }

        // Load the data into cheerio
        const $ = cheerio.load(data);
        const products = [];

        $('table.tabel tr').each((index, element) => {
            const cells = $(element).find('td');
            if (cells.length > 0) {
                const product = {
                    kode: $(cells[0]).text(),
                    keterangan: $(cells[1]).text(),
                    harga: $(cells[2]).text(),
                    status: $(cells[3]).text()
                };
                products.push(product);
            }
        });

        res.json(products);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
