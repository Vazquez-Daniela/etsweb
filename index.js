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
    password: req.body.password, // en texto plano
    tipo_usuario: req.body.t_usuario
};
    try {
        const client = new MongoClient(mongoUri);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('usuarios');

        await collection.insertOne(datos);
        client.close();
        /**Redireccionarlo a la pagina de login */
       res.redirect('/Ingresar.html');
    } catch (error) {
        console.error('Error al guardar:', error);
        res.status(500).send('Error al guardar en la base de datos.');
    }
});
/**
 * Verificacion del registro, Usuario ingrese a la pagina dependiendo de su tipo de usuario 
 */
/*
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const client = new MongoClient(mongoUri);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('usuarios');

        // Buscar usuario con email y contraseña
        const usuario = await collection.findOne({ email, password });

        if (!usuario) {
            res.send('<h2>Credenciales incorrectas</h2><a href="/Ingresar.html">Intentar de nuevo</a>');
        } else {
            if (usuario.tipo_usuario === 'cliente') {
                res.redirect('/Inicio.html');
            } else if (usuario.tipo_usuario === 'vendedor') {
                res.redirect('/vendedorI.html');
            } else {
                res.send('<h2>Tipo de usuario desconocido</h2>');
            }
        }

        await client.close();
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).send('Error interno del servidor.');
    }
});*/
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('usuarios');

    // Buscar por email
    const usuario = await collection.findOne({ email });

    if (usuario) {
      // Comparar contraseñas en texto plano
      if (usuario.password === password) {
        // Redirigir según tipo de usuario
        if (usuario.tipo_usuario === 'cliente') {
          res.redirect('/Inicio.html');
        } else if (usuario.tipo_usuario === 'vendedor') {
          res.redirect('/vendedorI.html');
        } else {
          res.send('Tipo de usuario no reconocido');
        }
      } else {
        res.send('Credenciales incorrectas: contraseña no válida');
      }
    } else {
      res.send('Credenciales incorrectas: usuario no encontrado');
    }
  } catch (error) {
    console.error('Error al conectar con MongoDB', error);
    res.status(500).send('Error del servidor');
  }
});


/**
 * Agregar productos a la base de datos 
 */
app.post('/guardarP', async (req, res) => {
    const { nombreP, Precio, Cantidad, des, Proveedor, categoria } = req.body;

    try {
        const producto = {
            nombre: nombreP,
            precio: parseFloat(Precio),
            cantidad: parseInt(Cantidad),
            descripcion: des,
            proveedor: Proveedor,
            categoria
        };

        await db.collection('productos').insertOne(producto);

        res.send('<h2>Producto agregado correctamente</h2><a href="/AgregarProducto.html">Volver</a>');
    } catch (error) {
        console.error('Error al guardar el producto:', error);
        res.status(500).send('Error al guardar el producto');
    }
});


app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
