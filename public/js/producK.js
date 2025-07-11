
  fetch('/productos?categoria=kids')
    .then(res => res.json())
    .then(productos => {
      const contenedor = document.getElementById('contenedor-productos');
      contenedor.innerHTML = '';

      productos.forEach(producto => {
        const div = document.createElement('div');
        div.className = 'item';

        div.innerHTML = `
          <span class="titulo-item">${producto.nombre}</span>
          <img src="${producto.imagen}" alt="" class="img-item">
          <span class="precio-item">$${producto.precio}</span>
          <button class="boton-item">Agregar al Carrito</button>
        `;

        contenedor.appendChild(div);
      });
    })
    .catch(err => {
      console.error('Error cargando productos:', err);
    });

