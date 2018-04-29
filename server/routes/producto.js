const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const _ = require('underscore');

let app = express();
let Producto = require('../models/producto');

//================================
// Obtener productos
//================================
app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario categoría
    //paginado 
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.count({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            });
        });
});



//================================
// Obtener un producto por id
//================================
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario y categoría
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
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
// Buscar productos
//================================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    //expresión regular, para coincidencias aproximadas, i es para hacer caso omiso de mayúsculas o minúsculas
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                res.status(500).json({
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
// Crear un producto
//================================
app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoría del listado
    let bod = req.body;
    let producto = new Producto({
        nombre: bod.nombre,
        precioUni: bod.precioUni,
        descripcion: bod.descripcion,
        disponible: true,
        categoria: bod.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoCreado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoCreado
        });
    });

});

//================================
// Actualizar un producto
//================================
app.put('/productos/:id', verificaToken, (req, res) => {
    let myId = req.params.id;
    let myBody = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria', 'usuario']);
    //console.log(typeof(myBody));
    Producto.findByIdAndUpdate(myId, myBody, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productoDB
        });
    });

});

//================================
// Borrar productos
//================================
app.delete('/productos/:id', verificaToken, (req, res) => {
    //no es borrado físico, disponible: false

    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado
        })
    });


});


module.exports = app;