const { json } = require('body-parser');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
// importacion del esquema para poder grabar la imagen
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// para borrar 
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    // tipos validos
    let tiposValidos = ['productos', 'usuarios'];

    // validando tipos
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.json({
            ok: false,
            err: {
                message: 'los tipos de usuario permitidos son ' + tiposValidos.join(', '),
            }
        });
    }

    let archivo = req.files.archivo;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'el archivo no existe'
            }
        });
    }

    let nombreCortado = archivo.name.split('.'); // obteniendo las extensiones
    let extension = nombreCortado[nombreCortado.length - 1];

    // extensiones de imagenes validas
    let extensionesValidas = ['jpg', 'gif', 'jpeg', 'png'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.json({
            ok: false,
            err: {
                message: 'las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }
    // variando el nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    // subiendo la imagen al servidor
    // hasta aqui tengo el id , el tipo y el nombre del archivo


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });

            }
            if (tipo === 'usuarios') {
                imagenUsuario(id, res, nombreArchivo);
            } else {
                imagenProducto(id, res, nombreArchivo);
            }
        }
        // la imagen ya ha sido subida

    );
});

//***************************************** */
//***** usuarios*******/
//**************************************** */
function imagenUsuario(id, res, nombreArchivo) { // id de usuario, el res se debe enviar
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // si no existe el usuario
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el usuario no existe'
                }
            });
        }
        // problemas que se duplica la imagen en la carpeta,  en la base de datos no hay problemas

        borrarArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            return res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // si no existe el usuario
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el usuario no existe'
                }
            });
        }
        // problemas que se duplica la imagen en la carpeta,  en la base de datos no hay problemas

        borrarArchivo(productoDB.img, 'productos'); // no me devolvia el nombre de la imagen
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            return res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });
}

//************************************ */
//***********no hay imgane en el modelo de producto*****/
//***************************************************** */
function borrarArchivo(nombreImagen, tipo) { // tipo: si es usuario o producto
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`); // estoy dentro de la carpeta routes por eso
    // necesito salir hacia arriba
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}


module.exports = app;