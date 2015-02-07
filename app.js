var express = require('express');
var app = express();

app.get('/', function(req, res) {
    // throw 'Error';
    res.send('Ok!');
});

module.exports = app;

