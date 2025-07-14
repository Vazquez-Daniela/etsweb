   const vendedor = localStorage.getItem('usuario');
    const tablaBody = document.querySelector("#tabla-productos tbody");

    if (!vendedor) {
      alert("Usuario no autenticado");
    } else {
      fetch(`/mis-productos/${vendedor}`)
        .then(res => res.json())
        .then(productos => {
          productos.forEach(p => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
             
              <td>${p.nombre}</td>
              <td>$${p.precio}</td>
              <td>$${p.cantidad}</td>
              <td>${p.descripcion}</td>
              <td>${p.categoria}</td>
            <td><img src="/imagen/${p._id}" alt="imagen"></td>
              <td>
                <button onclick="editarProducto('${p._id}', '${p.nombre}', ${p.precio}, ${p.cantidad},'${p.descripcion}', '${p.categoria}')">Editar</button>
                <button onclick="eliminarProducto('${p._id}')">Eliminar</button>
              </td>
            `;

            tablaBody.appendChild(tr);
          });
        })
        .catch(err => {
          console.error("Error al cargar productos:", err);
        });
    }

    function eliminarProducto(id) {
      if (confirm("¿Deseas eliminar este producto?")) {
        fetch(`/eliminar-producto/${id}`, {
          method: 'DELETE'
        }).then(res => {
          if (res.ok) location.reload();
          else alert("Error al eliminar producto");
        });
      }
    }

    function editarProducto(id, nombre, precio, cantidad, descripcion, categoria) {
      const nuevoNombre = prompt("Nuevo nombre:", nombre);
      const nuevoPrecio = prompt("Nuevo precio:", precio);
      const nuevacantidad = prompt("Nueva cantidad:",cantidad);
      const nuevaDesc = prompt("Nueva descripción:", descripcion);
      const nuevaCat = prompt("Nueva categoría:", categoria);

      if (nuevoNombre && nuevoPrecio &&nuevacantidad && nuevaDesc && nuevaCat) {
        fetch(`/editar-producto/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: nuevoNombre,
            precio: parseFloat(nuevoPrecio),
            cantidad: parseInt(nuevacantidad),
            descripcion: nuevaDesc,
            categoria: nuevaCat
          })
        }).then(res => {
          if (res.ok) location.reload();
          else alert("Error al editar producto");
        });
      }
    }