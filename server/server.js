require('./config/config');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
//boby-parser procesa la información del POST (la que se envía al servidor)
//y la serializa en un objeto JSON para que sea fácilmente utilizada

//use: MIDDLEWARES, cada petición que se haga siempre pasa por estas líneas
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/', function(req, res) {
    //res.send('Hello world');
    res.json('Hello world');
});


app.get('/usuario', function(req, res) {
    res.json('Get usuario');
});

app.post('/usuario', function(req, res) {
    let bod = req.body;

    if (bod.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: bod
        });
    }


});

app.put('/usuario', function(req, res) {
    res.json('Put usuario');
});

app.put('/usuario/:id', function(req, res) {
    let myId = req.params.id; //Este texto 'id' debe coincidir con el de /usuario/:id
    res.json({
        id: myId
    });
});

app.delete('/usuario', function(req, res) {
    res.json('Delete usuario');
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto ', process.env.PORT);
})