'use strict';

var express = require('express');

var router = express.Router();

var hour = 3600000;
var userList = [
    { username: 'u',
      email: 'u@u.com',
      password: 'u'},
    { username: 'matti',
      email: 'matti@a.com',
      password: 'ittam'},
    { username: 'pasi',
      email: 'paha35@hotmail.co.uk',
      password: '35hapa'}
];


function findUser(username) {
    for (var i = 0; i < userList.length; i++) {
        if (userList[i].username === username)
            return userList[i];
    }
    return null;
}

router.get('/', function(req, res) {
    if (req.session.username) {
        var u = findUser(req.session.username);
        if (u) {
            res.send({username: u.username, email: u.email});
            return;
        }
    }
    res.send({});
});

router.post('/', function(req, res) {
    if (!findUser(req.body.username)) {
        res.send({ exists: true});
    } else {
        res.send({ exists: false });
    }
});

router.post('/login', function(req, res) {
    // Use timeout to demonstrate a delay...
    setTimeout(function() {
        var u = findUser(req.body.username);
        if (u && u.password === req.body.password) {
            req.session.username = req.body.username;
            req.session.cookie.maxAge = hour;
            res.send({username: req.body.username, email: u.email});
        } else {
            res.sendStatus(401);
        }
    }, 1000);
});

router.get('/logout', function(req, res) {
    req.session.destroy();
    res.sendStatus(200);
});

router.post('/register', function(req, res) {
    setTimeout(function() {
        if (findUser(req.body.username)) {
            res.sendStatus(401);
        } else {
            userList.push({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });
            req.session.username = req.body.username;
            req.session.cookie.maxAge = hour;
            res.send({username: req.body.username, email: req.body.email});
        }
    }, 1000);
});

module.exports = router;
