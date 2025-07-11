
const express = require("express");
const cors = require("cors");
const session = require('express-session');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

var app = express(); //Contenedor de Endpoints o WS Restful

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


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
        /**Redireccionarlo a la pagina de login */
       res.redirect('/Ingresar.html');
    } catch (error) {
        console.error('Error al guardar:', error);
        res.status(500).send('Error al guardar en la base de datos.');
    }
});
/**
 * Iniciar sesion 
 */

// Middleware necesario ANTES de cualquier ruta que use req.session
app.use(session({
  secret: 'clave-secreta', // pon algo más seguro en producción
  resave: false,
  saveUninitialized: true
}));

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('usuarios');

    const usuario = await collection.findOne({ email });

    if (usuario && usuario.password === password) {
      // Guardar en sesión
      req.session.usuario = {
        email: usuario.email,
        nombre: usuario.nombre,
        tipo: usuario.tipo_usuario
      };

      if (usuario.tipo_usuario === 'cliente') {
        res.redirect('/Inicio.html');
      } else if (usuario.tipo_usuario === 'vendedor') {
        res.redirect('/vendedorI.html');
      } else {
        res.send('Tipo de usuario no reconocido');
      }
    } else {
      res.send('Credenciales incorrectas');
    }
  } catch (error) {
    console.error('Error en login', error);
    res.status(500).send('Error del servidor');
  }
});
/**
 * Ver el nombre del usuario, una vez que inicia session.
 */
app.get('/session-usuario', (req, res) => {
  if (req.session && req.session.usuario) {
    res.json({ nombre: req.session.usuario.nombre });
  } else {
    res.json({});
  }
});

/**
 * Cerrar sesion del usuario 
 */
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).send('Error al cerrar sesión');
    }
    res.clearCookie('connect.sid');
    res.sendStatus(200); // OK
  });
});
/**
 * Agregar productos a la base de datos 
 */
// Configurar almacenamiento de imagenes con multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/ima/productos'); // Asegúrate que esta carpeta exista
  },
  filename: function (req, file, cb) {
    const nombreArchivo = Date.now() + path.extname(file.originalname);
    cb(null, nombreArchivo);
  }
});
const upload = multer({ storage });

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Para servir imágenes si lo necesitas

app.post('/guardarP', upload.single('imagen'), async (req, res) => {
  const { nombreP, Precio, Cantidad, des, Proveedor, categoria } = req.body;

  let imagenData = null;

  if (req.file) {
    const buffer = fs.readFileSync(req.file.path);
    imagenData = {
      datos: new Binary(buffer),
      tipo: req.file.mimetype,
      nombre: req.file.originalname
    };
  }

  const producto = {
    nombre: nombreP,
    precio: parseFloat(Precio),
    cantidad: parseInt(Cantidad),
    descripcion: des,
    proveedor: Proveedor,
    categoria: categoria.charAt(0).toUpperCase() + categoria.slice(1),
    imagen: imagenData
  };

  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);
    await db.collection('productos').insertOne(producto);
    await client.close();

    // Opcional: borrar archivo físico si no lo necesitas
    //fs.unlinkSync(req.file.path);

    res.status(200).send('Producto guardado correctamente');
  } catch (error) {
    console.error('Error al guardar el producto:', error);
    res.status(500).send('Error al guardar');
  }
});

/**
 * LLenar la pagina automaticamente de Kids
 */
app.get('/productos/kids', async (req, res) => {
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);

    const productos = await db.collection('productos').find({ categoria: "Kids" }).toArray();
    await client.close();

    res.json(productos);
  } catch (error) {
    console.error('Error al cargar productos Kids:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
