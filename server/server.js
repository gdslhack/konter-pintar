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

app.get('/api/scrape', async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Ganti URL ini dengan URL target
    await page.goto('https://smartinkuota.otoreport.com/harga.js.php?id=1c8c62af3b9c9988fbde1297a58c93fb2daf0a46ff0046f2eb4a667b5f6a84424c8979bda21070b31e588dcbc750420b-8', {
      waitUntil: 'networkidle2'
    });

    const data = await page.evaluate(() => {
      const tables = Array.from(document.querySelectorAll('table'));
      return tables.map(table => {
        const rows = Array.from(table.querySelectorAll('tr'));
        return rows.map(row => {
          const cells = Array.from(row.querySelectorAll('td, th'));
          return cells.map(cell => cell.innerText);
        });
      });
    });

    // Filter data berdasarkan prefix operator
    const filteredData = data.filter(table => {
      return table.some(row => {
        // Asumsi nomor telepon ada di kolom tertentu, misal kolom ke-2
        const phoneNumber = row[1];
        if (phoneNumber) {
          const prefix = phoneNumber.slice(0, 4);
          return prefixOperators.hasOwnProperty(prefix);
        }
        return false;
      });
    });

    res.json(filteredData);
    await browser.close();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
    console.log('Server is running on port 3000');
});
