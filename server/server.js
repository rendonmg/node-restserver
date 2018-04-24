require('./config/config');

const express = require("express");
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
//boby-parser procesa la información del POST (la que se envía al servidor)
//y la serializa en un objeto JSON para que sea fácilmente utilizada

//use: MIDDLEWARES, cada petición que se haga siempre pasa por estas líneas
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

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