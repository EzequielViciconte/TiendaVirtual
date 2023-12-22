const mongoose = require('mongoose');
require('./config/Db');

const express = require('express');
const routes = require('./routes');
const path = require('path');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');
const MongoStore = require('connect-mongo');
const expressValidator = require('express-validator');

// Crear APP Express
const app = express();

// Habilitar body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Archivos Estaticos
app.use(express.static('public'))

// Validar Campos
app.use(expressValidator());

// Crear Sesion
app.use(cookieParser());

app.use(session({
    secret:'secreto',
    key:'password',
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({mongoUrl:'mongodb+srv://viciconteezequiel:Bocala122014@tiendacluster.nvt3qcw.mongodb.net/TiendaVirtual'})
}))

app.use(passport.initialize());
app.use(passport.session());

// Agregar Flash MSG
app.use(flash());

// Middleware propio 
app.use ((req,res,next)=> {
    res.locals.usuario = {...req.user} || null;
    res.locals.mensajes = req.flash();
    next();
});

// Iniciar Pug
app.set('view engine', 'pug');

// Carpeta View
app.set('views',path.join(__dirname,'./views'));

app.use('/',routes());

app.listen(3000);
