
var carritoVisible = false;

if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready)
} else {
  ready();
}

function ready() {
  cargarCarritoDesdeLocalStorage();

  document.getElementById('contenedor-productos')?.addEventListener('click', function (e) {
    if (e.target.classList.contains('boton-item')) {
      agregarAlCarritoClicked(e);
    }
  });

  document.querySelector('.btn-pagar')?.addEventListener('click', () => {
    guardarCarritoEnLocalStorage();
    window.location.href = 'Compra.html';
  });
}

function pagarClicked() {
  const carritoItems = document.getElementsByClassName('carrito-items')[0];
  while (carritoItems.hasChildNodes()) {
    carritoItems.removeChild(carritoItems.firstChild);
  }
  actualizarTotalCarrito();
  ocultarCarrito();
  localStorage.removeItem('carrito');
}

function agregarAlCarritoClicked(event) {
  const item = event.target.closest('.item');
  const titulo = item.querySelector('.titulo-item').innerText;
  const precio = item.querySelector('.precio-item').innerText;
  const imagenSrc = item.querySelector('.img-item').src;
  agregarItemAlCarrito(titulo, precio, imagenSrc);
  hacerVisibleCarrito();
}

function hacerVisibleCarrito() {
  carritoVisible = true;
  document.querySelector('.carrito').style.marginRight = '0';
  document.querySelector('.carrito').style.opacity = '1';
  document.querySelector('.contenedor-items').style.width = '60%';
}

function agregarItemAlCarrito(titulo, precio, imagenSrc, cantidad = 1, guardar = true) {
  const itemsCarrito = document.querySelector('.carrito-items');
if (!itemsCarrito) {
  console.warn('No se encontró .carrito-items en el DOM.');
  return;
}
  const nombresItems = itemsCarrito.getElementsByClassName('carrito-item-titulo');
  for (let i = 0; i < nombresItems.length; i++) {
    if (nombresItems[i].innerText === titulo) {
      alert("El item ya se encuentra en el carrito");
      return;
    }
  }

  const item = document.createElement('div');
  item.classList.add('item');
  item.innerHTML = `
    <div class="carrito-item">
      <img src="${imagenSrc}" width="20px" alt="">
      <div class="carrito-item-detalles">
        <span class="carrito-item-titulo">${titulo}</span>
        <div class="selector-cantidad">
          <i class="fa-solid fa-minus restar-cantidad"></i>
          <input type="text" value="${cantidad}" class="carrito-item-cantidad" disabled>
          <i class="fa-solid fa-plus sumar-cantidad"></i>
        </div>
        <span class="carrito-item-precio">${precio}</span>
         ${prod.agotado ? '<span class="agotado-label">AGOTADO</span>' : ''}
      </div>
      <button class="btn-eliminar"><i class="fa-solid fa-trash"></i></button>
    </div>`;

  item.querySelector('.btn-eliminar').addEventListener('click', eliminarItemCarrito);
  item.querySelector('.sumar-cantidad').addEventListener('click', sumarCantidad);
  item.querySelector('.restar-cantidad').addEventListener('click', restarCantidad);

  itemsCarrito.appendChild(item);
  actualizarTotalCarrito();
  if (guardar) guardarCarritoEnLocalStorage();
}

function eliminarItemCarrito(event) {
  const item = event.target.closest('.item');
  item.remove();
  actualizarTotalCarrito();
  guardarCarritoEnLocalStorage();
  ocultarCarrito();
}

function restarCantidad(event) {
  const selector = event.target.parentElement;
  let cantidad = parseInt(selector.querySelector('.carrito-item-cantidad').value);
  if (cantidad > 1) {
    selector.querySelector('.carrito-item-cantidad').value = cantidad - 1;
    actualizarTotalCarrito();
    guardarCarritoEnLocalStorage();
  }
}

function sumarCantidad(event) {
  const selector = event.target.parentElement;
  let cantidad = parseInt(selector.querySelector('.carrito-item-cantidad').value);
  selector.querySelector('.carrito-item-cantidad').value = cantidad + 1;
  actualizarTotalCarrito();
  guardarCarritoEnLocalStorage();
}

function ocultarCarrito() {
  const carritoItems = document.querySelector('.carrito-items');
  if (carritoItems.childElementCount === 0) {
    document.querySelector('.carrito').style.marginRight = '-100%';
    document.querySelector('.carrito').style.opacity = '0';
    carritoVisible = false;
    document.querySelector('.contenedor-items').style.width = '100%';
  }
}

function actualizarTotalCarrito() {
  const carritoItems = document.querySelectorAll('.carrito-item');
  let total = 0;

  carritoItems.forEach(item => {
    const precioTexto = item.querySelector('.carrito-item-precio').innerText;
    const cantidad = parseInt(item.querySelector('.carrito-item-cantidad').value);
    const precio = parseFloat(precioTexto.replace(/[^\d.-]/g, ''));
    total += precio * cantidad;
  });

  total = Math.round(total * 100) / 100;

  const totalFormateado = total.toLocaleString('en-MX', {
    style: 'currency',
    currency: 'MXN'
  });

  document.querySelector('.carrito-precio-total').innerText = totalFormateado;
}

function guardarCarritoEnLocalStorage() {
  const carritoItems = document.querySelectorAll('.carrito-item');
  const productos = [];

  carritoItems.forEach(item => {
    const titulo = item.querySelector('.carrito-item-titulo').innerText;
    const precio = item.querySelector('.carrito-item-precio').innerText;
    const imagen = item.querySelector('img').src;
    const cantidad = parseInt(item.querySelector('.carrito-item-cantidad').value);
    productos.push({ titulo, precio, imagen, cantidad });
  });

  localStorage.setItem('carrito', JSON.stringify(productos));
}

function cargarCarritoDesdeLocalStorage() {
  const productos = JSON.parse(localStorage.getItem('carrito')) || [];
  productos.forEach(p => {
    agregarItemAlCarrito(p.titulo, p.precio, p.imagen, p.cantidad, false);
  });

  if (productos.length > 0) {
    hacerVisibleCarrito();
    actualizarTotalCarrito();
  }
}
