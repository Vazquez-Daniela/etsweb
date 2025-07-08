/**
 * Conexion con mongodb
 */
const express = require("express");
const cors = require("cors");
var app = express(); //Contenedor de Endpoints o WS Restful

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const axios = require('axios');
//Variables para conectar con MongoDB
const { MongoClient } = require("mongodb");
const mongoUri =  
"mongodb+srv://dani:VNLlzT80Z16o1yi9@cluster0.114xfzo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(mongoUri);
const dbName = "unisport";
let db;

// Conectar a MongoDB
async function conectarMongo() {
    try {
        await client.connect();
        console.log("Conectado a MongoDB");
        db = client.db(dbName);
    } catch (err) {
        console.error("Error conectando a MongoDB:", err);
    }
}
conectarMongo();
/**
 * Guardar datos del registro
 */
app.post('/guardar', async (req, res) => {
    const datos = {
        nombre: req.body.name,
        apellidos: req.body.apelli,
        telefono: req.body.telefono,
        email: req.body.email,
        password: req.body.password,
        tipo_usuario: req.body.t_usuario
    };

    try {
        const client = new MongoClient(mongoUri);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('usuarios');

        await collection.insertOne(datos);
        client.close();

        res.send('<h2>Datos guardados correctamente</h2><a href="/">Volver</a>');
    } catch (error) {
        console.error('Error al guardar:', error);
        res.status(500).send('Error al guardar en la base de datos.');
    }
});
/**
 * Verificacion del registro, Usuario ingrese a la pagina dependiendo de su tipo de usuario 
 */

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
