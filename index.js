require('dotenv').config()
const prefController = require('./controllers/prefController.js');
const express = require('express');
const app = express();
const { prefRouter } = require('./routers/prefRouter.js');
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.set('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE");
    res.set('Content-Type', 'application/json');
    next();
});

app.use('/api/users', prefRouter);

app.listen(port);




