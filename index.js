/**
 * Conexion con mongodb
 */
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/?retryWrites=true&w=majority"; // cambia esto
const client = new MongoClient(uri);
let db;

async function conectarMongo() {
    try {
        await client.connect();
        db = client.db("unisport"); // tu base de datos
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error al conectar con MongoDB", error);
    }
}
conectarMongo();
/**
 * Guardar datos del registro
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
