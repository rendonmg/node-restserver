const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario incorrecto'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Contraseña incorrecta' //sólo para el desarrollo, no es necesario ni recomendable decir específicamente qué falló
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB,

        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //30 días

        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
        });

    });


});

module.exports = app;