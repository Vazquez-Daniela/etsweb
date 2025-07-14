

document.addEventListener('DOMContentLoaded', () => {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const tablaBody = document.querySelector('#tabla-compra tbody');
  const totalInput = document.getElementById('total');
  let totalCompra = 0;

  if (!tablaBody || !totalInput) {
    console.warn("La tabla de compra no está correctamente definida en el HTML.");
    return;
  }

  if (carrito.length === 0) {
    tablaBody.innerHTML = '<tr><td colspan="4">No hay productos en el carrito.</td></tr>';
    totalInput.value = '$0.00';
    return;
  }

  carrito.forEach(p => {
    const fila = document.createElement('tr');
    const precioNum = parseFloat(p.precio.replace(/[^\d.-]/g, ''));
    const totalProducto = precioNum * p.cantidad;
    totalCompra += totalProducto;

    fila.innerHTML = `
      <td>${p.titulo}</td>
      <td>$${precioNum.toFixed(2)}</td>
      <td>${p.cantidad}</td>
      <td>$${totalProducto.toFixed(2)}</td>
    `;
    tablaBody.appendChild(fila);
  });

  totalInput.value = `$${totalCompra.toFixed(2)}`;
});

function finalizarCompra() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const comprador = localStorage.getItem('usuario');

  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  if (!comprador) {
    alert("No se encontró el nombre del usuario.");
    return;
  }

  const productos = carrito.map(p => {
    const precio = parseFloat(p.precio.replace(/[^\d.-]/g, ''));
    return {
      nombre: p.titulo,
      precio,
      cantidad: p.cantidad,
      totalProducto: parseFloat((precio * p.cantidad).toFixed(2))
    };
  });

  const total = productos.reduce((sum, p) => sum + p.totalProducto, 0);

  const compra = {
    fecha: new Date().toISOString(),
    comprador: comprador,
    productos: productos,
    total: parseFloat(total.toFixed(2))
  };

  fetch('/guardar-compra', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(compra)
  })
    .then(res => {
      if (res.ok) {
        alert("Compra registrada exitosamente.");
        localStorage.removeItem('carrito');
        window.location.href = 'Inicio.html';
      } else {
        alert("Error al registrar la compra.");
      }
    })
    .catch(err => {
      console.error("Error al enviar datos:", err);
      alert("Error de conexión al guardar compra.");
    });
}
