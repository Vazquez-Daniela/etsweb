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
              <td><img src="/imagen/${p._id}" alt="imagen"></td>
              <td>${p.nombre}</td>
              <td>$${p.precio}</td>
              <td>${p.descripcion}</td>
              <td>${p.categoria}</td>
              <td>
                <button onclick="editarProducto('${p._id}', '${p.nombre}', ${p.precio}, '${p.descripcion}', '${p.categoria}')">Editar</button>
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

    function editarProducto(id, nombre, precio, descripcion, categoria) {
      const nuevoNombre = prompt("Nuevo nombre:", nombre);
      const nuevoPrecio = prompt("Nuevo precio:", precio);
      const nuevaDesc = prompt("Nueva descripción:", descripcion);
      const nuevaCat = prompt("Nueva categoría:", categoria);

      if (nuevoNombre && nuevoPrecio && nuevaDesc && nuevaCat) {
        fetch(`/editar-producto/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: nuevoNombre,
            precio: parseFloat(nuevoPrecio),
            descripcion: nuevaDesc,
            categoria: nuevaCat
          })
        }).then(res => {
          if (res.ok) location.reload();
          else alert("Error al editar producto");
        });
      }
    }