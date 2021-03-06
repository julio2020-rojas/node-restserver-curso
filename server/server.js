/* jshint esversion:8 */
require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const mongoose = require('mongoose');


// midleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// habilitar la carpeta public 
app.use(express.static(path.resolve(__dirname, '../public')));

// configuracion global de rutas
app.use(require('./routes/index'));

/*
app.use(require('./routes/usuario'));
app.use(require('./routes/login'));*/


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) throw (err);
        console.log('base de datos ONLINE');
    });

app.listen(process.env.PORT, () => {
    console.log('escuchando puerto ', process.env.PORT);
});