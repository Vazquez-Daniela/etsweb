
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
const { MongoClient, ObjectId, Binary } = require('mongodb');
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

       const usuarioExistente = await collection.findOne({ email: datos.email });

    if (usuarioExistente) {
      //Verifica que el email no exista y asi evitar duplicado de email.
      res.send(`
        <script>
          alert('El correo electrónico ya está registrado.');
          window.location.href = '/Registro.html';
        </script>
      `);
      return;
    }

    await collection.insertOne(datos);
    client.close();

    console.log("Usuario guardado con éxito en MongoDB.");
    res.send(`
      <script>
        alert('Registrado correctamente');
        window.location.href = '/Ingresar.html';
      </script>
    `);
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
  secret: 'clave-secreta', 
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
    //console.log("usuario:", req.session.usuario.nombre); 
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
 * 
 * Funciones para hacer que se vea la informacion de los productos 
 * 
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
app.use(express.static('public')); 

app.post('/guardarP', upload.single('imagen'), async (req, res) => {
  const { nombreP, Precio, Cantidad, des, Proveedor, categoria } = req.body;

 
  console.log("Datos del formulario recibidos:", req.body);
  console.log("Proveedor recibido:", Proveedor);

  
  if (!nombreP || !Precio || !Cantidad || !des || !Proveedor || !categoria) {
    return res.status(400).send("Todos los campos son obligatorios.");
  }

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
    proveedor: Proveedor,  // Asegúrate que la clave es Proveedor, no proveedor
    categoria: categoria.charAt(0).toUpperCase() + categoria.slice(1),
    imagen: imagenData
  };

  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);
    await db.collection('productos').insertOne(producto);
    await client.close();

    console.log("Producto guardado con éxito en MongoDB.");
        res.send(`
      <script>
        alert('Producto registrado correctamente');
        window.location.href = '/AgregarP.html';
      </script>
    `);

  } catch (error) {
    console.error("Error al guardar el producto:", error);
    res.status(500).send("Error al guardar el producto.");
  }
});

app.get('/imagen/:id', async (req, res) => {
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);
    const producto = await db.collection('productos').findOne({ _id: new ObjectId(req.params.id) });
    await client.close();

    if (!producto || !producto.imagen || !producto.imagen.datos) {
      return res.status(404).send('Imagen no encontrada');
    }

    res.contentType(producto.imagen.tipo);
    res.send(producto.imagen.datos.buffer);
  } catch (error) {
    console.error('Error al obtener imagen:', error);
    res.status(500).send('Error al cargar imagen');
  }
});
/**
 * LLenar la pagina inicio 
 */
app.get('/productos/todos', async (req, res) => {
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);

    const productos = await db.collection('productos').find({}).toArray();

    await client.close();

    res.json(productos);
  } catch (error) {
    console.error('Error al cargar productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
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

    const productos = await db.collection('productos').find({
      categoria: 'Kids',
      agotado: { $ne: true } // ❗ excluir productos agotados
    }).toArray();

    await client.close();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error al obtener productos');
  }
});
/**
 * LLenar la pagina automaticamente de Hombre
 */
app.get('/productos/hombre', async (req, res) => {
 try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);

    const productos = await db.collection('productos').find({
      categoria: 'Hombre',
      agotado: { $ne: true } // ❗ excluir productos agotados
    }).toArray();

    await client.close();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error al obtener productos');
  }
});
/**
 * LLenar la pagina automaticamente de Mujer
 */
app.get('/productos/mujer', async (req, res) => {
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);

    const productos = await db.collection('productos').find({
      categoria: 'Mujer',
      agotado: { $ne: true } // ❗ excluir productos agotados
    }).toArray();

    await client.close();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error al obtener productos');
  }
});

/**
 * 
 * OPERACIONES PARA MODIFICAR, ELIMINAR Y MOSTRAR LOS PRODUCTOS REGISTRADOS
 * 
 */

/**
 * Mostrar poductos
 */
app.get('/mis-productos/:vendedor', async (req, res) => {
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);
    const productos = await db.collection('productos').find({ proveedor: req.params.vendedor }).toArray();
    await client.close();
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error del servidor");
  }
});

/**
 * Modificar Productos
 */
app.post('/editar-producto/:id', async (req, res) => {
  const { nombre, precio, descripcion, categoria, cantidad } = req.body;

  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);

    await db.collection('productos').updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          nombre,
          precio: parseFloat(precio),
          descripcion,
          categoria,
          cantidad: parseInt(cantidad)  
        }
      }
    );

    await client.close();
    res.sendStatus(200);
  } catch (error) {
    console.error("Error al editar producto:", error);
    res.status(500).send("Error al editar");
  }
});

/**
 * Eliminar Producto
 */
app.delete('/eliminar-producto/:id', async (req, res) => {
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(dbName);
  await db.collection('productos').deleteOne({ _id: new ObjectId(req.params.id) });
  await client.close();
  res.sendStatus(200);
});

/**
 * 
 * Guardar compra 
 * 
 */
app.post('/guardar-compra', async (req, res) => {
  const { fecha, comprador, productos, total } = req.body;

  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);

    // 1. Insertar la compra
    await db.collection('compras').insertOne({
      fecha: new Date(fecha),
      comprador,
      productos,
      total
    });

    // 2. Por cada producto, restar cantidad y actualizar agotado si es necesario
    for (const p of productos) {
      const productoActual = await db.collection('productos').findOne({ nombre: p.nombre });

      if (productoActual) {
        const nuevaCantidad = productoActual.cantidad - p.cantidad;

        await db.collection('productos').updateOne(
          { nombre: p.nombre },
          {
            $set: {
              cantidad: nuevaCantidad,
              agotado: nuevaCantidad <= 0
            }
          }
        );
      }
    }

    await client.close();
    res.sendStatus(200);
  } catch (error) {
    console.error("Error al guardar compra o actualizar inventario:", error);
    res.status(500).send("Error al procesar la compra");
  }
});
/**
 * SERVIDOR ESCUCHANDO
 */
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
