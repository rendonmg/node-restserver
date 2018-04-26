require('./config/config');

const express = require("express");
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');
//boby-parser procesa la información del POST (la que se envía al servidor)
//y la serializa en un objeto JSON para que sea fácilmente utilizada

//use: MIDDLEWARES, cada petición que se haga siempre pasa por estas líneas
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//habilitar la carpeta public (middleware para hacer público el directorio)
//app.use(express.statis(__dirname + '../public')); //este no funciona, probarlo con un console.log(__dirname + '../public')
//se debe usar path
app.use(express.static(path.resolve(__dirname, '../public')));

//configuración global de rutas
app.use(require('./routes/index.js'));
// app.use(require('./routes/usuario'));
// app.use(require('./routes/login'));

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto ', process.env.PORT);
})