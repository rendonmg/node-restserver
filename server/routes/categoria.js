const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
const _ = require('underscore');
let Categoria = require('../models/categoria');

//en todas las peticiones se debe validar el token

//mostrar todas las categorías
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count((err, conteo) => {
                res.json({
                    ok: true,
                    categorias: categorias,
                    cuantas: conteo
                });
            })

        });
});

//mostrar una categoría por id 
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById(...)
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if (!categoriaDB) {
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

//crear nueva categoría
app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {
    //regresar la nueva categoría después de crearla
    //tengo el id del usuario en el token, por eso tengo acceso a req.usuario._id

    let bod = req.body;

    //crear la nueva instancia de categoriaSchema
    let categoria = new Categoria({
        nombre: bod.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if (!categoriaDB) {
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

//actualizar una categoría
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let myId = req.params.id;
    let myBody = _.pick(req.body, ['nombre']);
    Categoria.findByIdAndUpdate(myId, myBody, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if (!categoriaDB) {
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

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo un admin puede borrar categoría
    //eliminarla físicamente findByIdandRemove...
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'Ocurrió un error!',
                    err
                }
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoría no encontrada"
                }
            });
        }

        res.json({
            ok: true,
            //categoria: categoriaBorrada
            message: 'Categoría borrada'
        });
    });

});

module.exports = app;