const express = require('express');
const apiRouter = require('./api');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.use('*', (req, res) => {
  //res.sendFile(path.join(__dirname, 'myEntryPoint.html'));//???
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use((req, res) => {//???
  res.status(404).send('404 Page not found ERROR!...');
})

module.exports = app;