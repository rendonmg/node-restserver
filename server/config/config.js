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
//Vencimiento del token
//==========================
//60 segundos *
//60 minutos *
//24 horas *
//30 días
process.env.CADUCIDAD_TOKEN = '48h'; //60 * 60 * 24 * 30;


//==========================
//SEED de autenticación
//==========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//==========================
//Base de datos
//==========================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;


//==========================
//Google client id
//==========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '929140557059-72k4lj2adb0ndm7404mbljf12b117gof.apps.googleusercontent.com'