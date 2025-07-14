
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
        window.location.href = 'Principal.html';
      } else {
        alert("rror al registrar la compra.");
      }
    })
    .catch(err => {
      console.error("Error al enviar datos:", err);
      alert("Error de conexión al guardar compra.");
    });
  }

