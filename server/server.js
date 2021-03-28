/* jshint esversion:8 */
require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');


// midleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.use(require('./routes/usuario'));

/*
await mongoose.connect('mongodb://localhost/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});*/

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) throw (err);
        console.log('base de datos ONLINE');
    });

app.listen(process.env.PORT, () => {
    console.log('escuchando puerto ', process.env.PORT);
});