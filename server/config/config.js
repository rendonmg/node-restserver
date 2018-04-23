//import { url } from "inspector";

//como el require que se está haciendo en server.js está llamando esta configuración en la primera línea
//se van a realizar las configuraciones GLOBALES aquí definidas

//==========================
//Puerto
//==========================
process.env.PORT = process.env.PORT || 3000;


//==========================
//Entorno
//==========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev' //es una variable que gestiona heroku en producción


//==========================
//Base de datos
//==========================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:123456@ds157667.mlab.com:57667/cafe';
}

process.env.URLDB = urlDB;