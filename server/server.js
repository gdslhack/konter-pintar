const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

let productData = {};

// Ambil data produk saat server pertama kali berjalan
axios.get('https://smartinkuota.otoreport.com/harga.js.php?id=1c8c62af3b9c9988fbde1297a58c93fb2daf0a46ff0046f2eb4a667b5f6a84424c8979bda21070b31e588dcbc750420b-8')
    .then(response => {
        productData = response.data;
        console.log('Data produk berhasil diambil:', productData);
    })
    .catch(error => {
        console.error('Gagal mengambil data produk:', error);
    });

app.post('/api/order', (req, res) => {
    const { product, phoneNumber, denom } = req.body;
    const orderNumber = `SIK${Math.floor(10000 + Math.random() * 90000)}`;

    let message = `*PESANAN NO unik #${orderNumber}*\n\nTujuan: ${phoneNumber}\nProduk: ${product}`;
    if (product === 'pln') {
        message += `\nDenom: ${denom}k`;
    }
    message += `\n\nJika sudah bayar segera proses, Trimsss`;

    axios.post(`https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage`, {
        chat_id: '<YOUR_CHAT_ID>',
        text: message,
        parse_mode: 'Markdown'
    })
    .then(response => {
        res.json({ status: 'success', message: 'Order received and notification sent.' });
    })
    .catch(error => {
        console.error('Telegram API Error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to send notification.' });
    });
});

app.get('/api/products', (req, res) => {
    res.json(productData);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
