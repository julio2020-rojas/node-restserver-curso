/* jshint esversion:8 */
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const { OAuth2Client } = require('google-auth-library');
const { json } = require('body-parser');
const client = new OAuth2Client(process.env.CLIENT_ID);
const app = express();


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            // error de la base de datos
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // la direccion de correo no es valida
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(usuario) o contraseña son incorrectos'
                }
            });
        }
        // la contraseña es incorrecta
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario o (contraseña) son incorrectos'
                }
            });
        }
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });

});

// configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true // esto por ser un usuario de google
    };

}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token) // verificamos el token si es valido tenemos toda la informacion del usuario 
        .catch(e => { // autenticado por google 
            return status(403).json({
                ok: false,
                err: e
            });
        });

    // se busca en el esquema o coleccion para ver si ese usuario ya existe con ese correo
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err // puede ser un error interno de la base de datos
            });
        }
        if (usuarioDB) {
            if (usuarioDB.google === false) { // el usuario uso su correo para autenticarse de forma directa 
                return res.status(400).json({
                    ok: false,
                    err: {
                        msg: ' debe usar su autenticacion normal..'
                            //el usuario se autentico de forma directa en la base de datos
                    }
                });
            } else {
                // el usuario ya se registro por google por lo que es necesario renovar su token personalizado
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.status(200).json({
                    ok: true,
                    msg: 'token renovado',
                    usuario: usuarioDB,
                    token
                });

            }
        } else {
            // si el usuario no existe , es un usuario nuevo
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            // lo grabamos en la base de datos
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err // puede ser un error interno de la base de datos
                    });
                }
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            });

        }
    });
    /*    
    res.json({
        usuario: googleUser
    });*/
});


module.exports = app;