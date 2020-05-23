const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

app.use(express.static('.'));
app.use(bodyParser.json());

app.get('/catalog', (req, res) => {
    fs.readFile('catalog.json', 'utf-8', (err, data) => {
        let jsonCatalog = JSON.parse(data);
        res.json(jsonCatalog);
    });
});

app.get('/basket', (req, res) => {
    fs.readFile('basket.json', 'utf-8', (err, data) => {
        let jsonBasket = JSON.parse(data);
        res.json(jsonBasket);
    });
});

app.post('/basket', (req, res) => {
    fs.writeFile('basket.json', JSON.stringify(req.body), () => {res.json({errorCode: 0})});
});

app.listen(3000, function() {
    console.log('server is running on port 3000');
});  
