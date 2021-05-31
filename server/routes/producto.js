const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
let Producto = require('../models/producto');



//================================
// Crea un producto
//================================
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria

    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

//================================
// actualiza un producto
//================================

app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            });
        }
        // cuando se haga el post quizas pueda haber problema en el orden 
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            });
        });

    });
});

//================================
// obtiene todos los productos
//================================

app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});

//================================
// obtiene un prodcuto por ID
//================================

app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'el ID no existe..'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });


});


//================================
// eliminar un producto cambiando su estado
//================================
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoDB) => {
        if (err) { // problemas internnos de la base de datos
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) { // no se pudo crear la categoria
            return res.status(400).json({
                ok: false,
                err: {
                    messsage: 'el id no existe'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB,
            message: 'categoria borrada'
        });
    });
});

//================================
// busqueda de productos
//================================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) { // problemas internnos de la base de datos
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});


module.exports = app;