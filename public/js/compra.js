let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const usuario = localStorage.getItem('usuario');
    const tablaBody = document.querySelector('#tabla-compra tbody');
    let totalCompra = 0;

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

    document.getElementById('total').value = `$${totalCompra.toFixed(2)}`;

    function finalizarCompra() {
      if (carrito.length === 0 || !usuario) {
        alert("Carrito vacío o usuario no autenticado");
        return;
      }

      const compra = {
        fecha: new Date().toISOString(),
        comprador: usuario,
        productos: carrito.map(p => {
          const precioNum = parseFloat(p.precio.replace(/[^\d.-]/g, ''));
          return {
            nombre: p.titulo,
            precio: precioNum,
            cantidad: p.cantidad,
            totalProducto: parseFloat((precioNum * p.cantidad).toFixed(2))
          };
        }),
        total: parseFloat(totalCompra.toFixed(2))
      };

      fetch('/guardar-compra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compra)
      }).then(res => {
        if (res.ok) {
          alert("Compra registrada exitosamente.");
          localStorage.removeItem('carrito');
          location.href = 'Principal.html';
        } else {
          alert("Error al registrar la compra");
        }
      });
    }