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
// Bases de datos
// ======================


let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //urlDB = process.env.MONGO_URI;
    //urlDB = 'mongodb://julio2021:talent002020@cluster0-shard-00-00.6u4qo.mongodb.net:27017/cafe';
    urlDB = 'mongodb://julio2021:talent002020@cluster0-shard-00-00.6u4qo.mongodb.net:27017/cafe?ssl=true&replicaSet=atlas-5vf06m-shard-0&authSource=admin&retryWrites=true&w=majority';

}

process.env.URLDB = urlDB;

//     urlDB = 'mongodb://julio2021:talent002020@cluster0-shard-00-00.6u4qo.mongodb.net:27017/cafe';


//    urlDB = 'mongodb://julio2021:talent002020@cluster0-shard-00-00.6u4qo.mongodb.net:27017/cafe?ssl=true&replicaSet=atlas-5vf06m-shard-0&authSource=admin&retryWrites=true&w=majority';


//    urlDB = 'mongodb://julio2021:talent002020@cluster0-shard-00-00.6u4qo.mongodb.net:27017,cluster0-shard-00-01.6u4qo.mongodb.net:27017,cluster0-shard-00-02.6u4qo.mongodb.net:27017/cafe?ssl=true&replicaSet=atlas-5vf06m-shard-0&authSource=admin&retryWrites=true&w=majority';
