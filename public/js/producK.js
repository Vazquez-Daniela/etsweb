document.addEventListener('DOMContentLoaded', async () => {
  const contenedor = document.getElementById('contenedor-productos');

  try {
    const respuesta = await fetch('/productos/kids');
    const productos = await respuesta.json();

    productos.forEach(prod => {
      const item = document.createElement('div');
      item.classList.add('item');

      item.innerHTML = `
        <span class="titulo-item">${prod.nombre}</span>
        <img src="/imagen/${prod._id}" alt="${prod.nombre}" class="img-item">
        <span class="precio-item">$${prod.precio.toFixed(2)}</span>
        <button class="boton-item">Agregar al Carrito</button>
      `;

      contenedor.appendChild(item);
    });
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
});

