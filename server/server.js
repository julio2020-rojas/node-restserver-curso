/* jshint esversion:8 */
require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// midleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.get('/usuario', function(req, res) {
    res.json('Hello get');
});
// crear nuevos registros
app.post('/usuario', function(req, res) {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'el nombre es necesario'
        });
    } else {
        res.json({
            Persona: body
        });
    }

});
//actualiza registros
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
});
// no se borra el registro fisico sino que se cambia la condicion del registro: no visible
app.delete('/usuario', function(req, res) {
    res.json('Hello delete');
});

app.listen(process.env.PORT, () => {
    console.log('escuchando puerto ', process.env.PORT);
});