'use strict';

var express = require('express');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var beer = require('./routes/beer');
var users = require('./routes/user');

var app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

/*
app.use(function(req, res, next) {
    console.log(req.path);
    next();
});
*/

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../client/views')));
app.use('/css', express.static(path.join(__dirname, '../client/css')));
app.use('/images', express.static(path.join(__dirname, '../client/images')));
app.use('/js', express.static(path.join(__dirname, '../client/js')));
app.use('/server', express.static(path.join(__dirname, '/')));
app.use('/vendor', express.static(path.join(__dirname, '../node_modules')));
app.use('/vendor2', express.static(path.join(__dirname, '../bower_components')));

app.use('/beer', beer);
app.use('/user', users);

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/views/index.html'));
});

app.listen(3001);
