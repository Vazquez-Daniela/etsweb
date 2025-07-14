const usuario = localStorage.getItem('usuario');
    const lista = document.getElementById('lista-productos');

    if (!usuario) {
      alert("Usuario no autenticado");
    } else {
      fetch(`/mis-productos/${usuario}`)
        .then(res => res.json())
        .then(productos => {
          productos.forEach(p => {
            const li = document.createElement('li');
            li.innerHTML = `
              <strong>${p.nombre}</strong> - $${p.precio} (${p.categoria})<br>
              ${p.descripcion}<br>
              <button onclick="editarProducto('${p._id}', '${p.nombre}', ${p.precio}, '${p.descripcion}', '${p.categoria}')">Editar</button>
              <button onclick="eliminarProducto('${p._id}')">Eliminar</button>
            `;
            lista.appendChild(li);
          });
        });
    }

    function eliminarProducto(id) {
      if (confirm('¿Estás seguro de eliminar este producto?')) {
        fetch(`/eliminar-producto/${id}`, { method: 'DELETE' })
          .then(res => res.ok ? location.reload() : alert("Error al eliminar"));
      }
    }

    function editarProducto(id, nombre, precio, descripcion, categoria) {
      const nuevoNombre = prompt("Nuevo nombre:", nombre);
      const nuevoPrecio = prompt("Nuevo precio:", precio);
      const nuevaDesc = prompt("Nueva descripción:", descripcion);
      const nuevaCategoria = prompt("Nueva categoría:", categoria);

      if (nuevoNombre && nuevoPrecio && nuevaDesc && nuevaCategoria) {
        fetch(`/editar-producto/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: nuevoNombre,
            precio: parseFloat(nuevoPrecio),
            descripcion: nuevaDesc,
            categoria: nuevaCategoria
          })
        }).then(res => res.ok ? location.reload() : alert("Error al editar"));
      }
    }