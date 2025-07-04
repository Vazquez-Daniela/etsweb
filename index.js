/**
 * Conexion con mongodb
 */
var express = require('express');
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
const dbName = "pagweb";
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
 * Guardar los datos de la pagina "Registro" a la base de datos
 */

app.post("/api/guardar", async (req, res) => {
    const { nombre, apelli, telefono, email, password, t_usuario } = req.body;

    try {
        await db.collection("usuarios").insertOne({
            nombre,
            apelli,
            telefono,
            email,
            password,
            t_usuario
        });

        res.json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        console.error("Error al insertar en MongoDB:", error);
        res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});