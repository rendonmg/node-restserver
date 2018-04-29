const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

//default options: middleware
//transforma lo que sea que se esté subiendo y lo coloca en un objeto llamado files
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files) {
        //return res.status(400).send('No files were uploaded')
        return res.status(400).json({
            ok: false,
            err: {
                message: "No se ha seleccionado ningún archivo"
            }
        });
    }

    //validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El tipo de archivo no es válido. Tipos admitidos: ' + tiposValidos.join(', '),
                ext: tipo
            }
        });
    }



    //archivo es el nombre de la clave del body que estará encargada del archivo
    let elArchivo = req.files.archivo;
    let nombreCortado = elArchivo.name.split('.');
    let extArchivo = nombreCortado[nombreCortado.length - 1];
    //extensiones premitidas
    let extValidas = ['png', 'jpg', 'gif', 'jpeg', 'tiff'];

    if (extValidas.indexOf(extArchivo.toLowerCase()) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'La extensión del archivo no es válida. Extensiones válidas: ' + extValidas.join(', '),
                ext: extArchivo
            }
        });
    }

    //cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extArchivo }`
        //elArchivo.name

    // Use the mv() method to place the file somewhere on your server
    elArchivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
        //return res.status(500).send(err);
            return res.status(500).json({
            ok: false,
            err
        });

        //aquí imagen cargada ya
        //console.log(id);
        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;
            case 'productos':
                imagenProducto(id, res, nombreArchivo);
                break;
                //default:
        }



        //res.send('File uploaded!');
        // res.json({
        //     ok: true,
        //     message: 'Archivo subido con éxito'
        // });
    });


});


function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        //verificar ruta del archivo (la imagen que ya tiene actualmente el usuario)
        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
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
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        //verificar ruta del archivo (la imagen que ya tiene actualmente el usuario)
        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            });
        });
    });
}

function borraArchivo(nombreImagen, nombreTipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${ nombreTipo }/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}
module.exports = app;