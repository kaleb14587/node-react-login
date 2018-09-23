var express = require('express');
var app = express();
require("dotenv").config();
var session = require('express-session');
// var bodyParser = require('body-parser');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.raw({ extended: true })); // support encoded bodies
app.use(bodyParser.text({ extended: true })); // support encoded bodies
console.log(__dirname);
const port = process.env.SERVER_PORT;
console.log(process.env.SERVER_PORT);
var auth = require('./server/auth/autentication');
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//|||||||||||||||||||||||||||DEFINIÇÃO DE MIDDLEWARE DE SESSAO ||||||||||||||||||||||||||||||||
//||||||||||||||||||||||||||||||||E CORS ||||||||||||||||||||||||||||||||||||||||||||||||||||||
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// Use the session middleware
app.use(session({secret: 'gerencia clinica'}));
// config cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//|||||||||||||||||||||||||||CONTROLLERS DEFINE |||||||||||||||||||||||||||||||||||||||||||||||
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//definições de controllers
var controller_admin = require('./server/controllers/AdminController');
var controller_auth = require('./server/controllers/authController');
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//|||||||||||||||||||||||||||DEFINIÇÃO DE ROTAS |||||||||||||||||||||||||||||||||||||||||||||||
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//rotas api
app.post('/login', auth.authentication);
app.post('/register',auth.is_authorized,controller_auth.register);
app.post('/users',auth.is_authorized, controller_auth.users);
app.get('/home/',auth.is_authorized,controller_admin.index );
app.post('/get-header',controller_admin.list_header );
// Access the session as req.session
app.get('/', function(req, res, next) {
    if (req.session.views) {
        req.session.views++
        res.setHeader('Content-Type', 'text/html');
        res.charset = 'utf-8';
        res.write('<p>views: ' + req.session.views + '</p>')
        res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
        res.end()
    } else {
        req.session.views = 1
        res.end('sessao aberta sem autenticação!')
    }
});

//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//|||||||||||||||||||||||||||ABERTURA DO SERVER |||||||||||||||||||||||||||||||||||||||||||||||
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
app.listen(port, () => console.log(`Listening on port ${port}`));
