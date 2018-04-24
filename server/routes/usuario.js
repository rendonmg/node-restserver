const express = require("express");

//para las encriptaciones de contraseñas
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion'); //recordar: destructuración

const app = express();

app.get('/', function(req, res) {
    //res.send('Hello world');
    res.json('Hello world');
});

//app.get(ruta, middleware(opcional), callback)
app.get('/usuario', verificaToken, function(req, res) {

    // //sólo para verificar que después de pasar por el middleware
    // //se tiene dentro del req toda la información del usuario, que es un usuario válido
    // //porque es lo que ya comprobamos en el middleware
    // // IMPORTANTE, por ejemplo, acá se podría extraer el tipo de usuario para decidir si puede o no eliminar, crear, editar, etc
    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });

    //los parámetros opcionales van en req.query
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios: usuarios,
                    cuantos: conteo
                })
            })

        });
});

app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {
    let bod = req.body;

    //crea una nueva instancia de usuarioSchema con todas sus propiedades
    let usuario = new Usuario({
        nombre: bod.nombre,
        email: bod.email,
        //password: bod.password,
        password: bcrypt.hashSync(bod.password, 10),
        role: bod.role
    })

    //.save es un palabra reservada de mongoose
    //devuelve un error o un id en caso de que sí pueda grabar la información en la DB de Mongo
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        // //simplemente es reemplazar el password en la respuesta,
        // //no quiere decir que se haya borrado, porque en la DB ya quedó
        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario', verificaToken, function(req, res) {
    res.json('Put usuario');
});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let myId = req.params.id; //Este texto 'id' debe coincidir con el de /usuario/:id
    //let myBody = req.body;

    // Usuario.findById(id, (err, usuarioDB) => {
    //     usuarioDB.save
    // });

    //si hay campos que no se deben actualizar, se pueden borrar del body
    //no obstante es mejor hacerlo con una librería UNDERSCORE
    // delete myBody.password;
    // delete myBody.google;

    let myBody = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(myId, myBody, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })
});

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    })

    // //borrado físico del usuario
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     //si no existe el usuario borrado pero tampoco se genera error (usuarioBorrado === null)
    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // });


});

module.exports = app;
//esto exporta el app pero adquiriendo las nuevas configuraciones de rutas