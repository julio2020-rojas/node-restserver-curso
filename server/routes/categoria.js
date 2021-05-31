const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');

//================================
// servicios 
//================================


//================================
// obtiene todas las categorias 
//================================
app.get('/categoria', (req, res) => {
    Categoria.find({})
        .sort('descripcion') // los ordena por la descripcion de categorias
        .populate('usuario', 'nombre email') // extrae el nombre y el email de la coleccion usuario
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            });
        });
});



//================================
// mostrar una categoria por id
//================================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el ID no existe..'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
//================================
// crear una nueva categora 
//================================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) { // problemas internnos de la base de datos
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) { // no se pudo crear la categoria
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//================================
// actualiza una categoria
//================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) { // problemas internnos de la base de datos
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) { // no se pudo crear la categoria
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//================================
// crear una nueva categora 
//================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) { // problemas internnos de la base de datos
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) { // no se pudo crear la categoria
            return res.status(400).json({
                ok: false,
                err: {
                    messsage: 'el id no existe'
                }
            });
        }
        res.json({
            ok: true,
            message: 'categoria borrada'
        });
    });

});



module.exports = app;