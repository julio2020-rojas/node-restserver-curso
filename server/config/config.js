/* jshint esversion:8 */

//variables globales

// ======================
// Puerto
// ======================

process.env.PORT = process.env.PORT || 3000;

// ======================
// Entorno
// ======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ======================
// vencimiento del token
// ======================
// 60 segundos*60 minutos*24 horas*30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ======================
// seed de autenticacion
// ======================
process.env.SEED = process.env.SEED || 'seed-de-desarrollo';
// ======================
// Bases de datos
// ======================


let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = `mongodb://${process.env.USER}:${process.env.PASSWORD}@cluster0-shard-00-00.6u4qo.mongodb.net:27017/cafe?ssl=true&replicaSet=atlas-5vf06m-shard-0&authSource=admin&retryWrites=true&w=majority`;

}

process.env.URLDB = urlDB;

// ======================
// Google Client Id
// ======================
process.env.CLIENT_ID = process.env.CLIENT_ID || '121804189319-b4t4e41dn9pefu5uj90p0kt103t30bvd.apps.googleusercontent.com';