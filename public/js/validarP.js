
  document.getElementById('formProducto').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombreP').value.trim();
    const precio = document.getElementById('Precio').value.trim();
    const cantidad = document.getElementById('Cantidad').value.trim();
    //const descripcion = document.getElementById('des').value.trim();
    const vendedor = localStorage.getItem('usuario');
    const categoria = document.getElementById('categoria').value;
    const imagen = document.getElementById('imagen').files[0];

    // Validaciones
    if (!nombre || !precio || !cantidad /*|| !descripcion*/ || !vendedor || !categoria || !imagen) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    if (isNaN(precio) || parseFloat(precio) <= 0) {
      alert('El precio debe ser un número positivo.');
      return;
    }

    if (!Number.isInteger(Number(cantidad)) || parseInt(cantidad) < 1) {
      alert('La cantidad debe ser un número entero mayor a 0.');
      return;
    }

    // Enviar usando FormData
    const formData = new FormData();
    formData.append('nombreP', nombre);
    formData.append('Precio', precio);
    formData.append('Cantidad', cantidad);
    //formData.append('des', descripcion);
    formData.append('Vendedor', vendedor);
    formData.append('categoria', categoria);
    formData.append('imagen', imagen);

    try {
      const response = await fetch('/guardarP', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Producto guardado correctamente.');
        this.reset(); // Limpiar el formulario
      } else {
        alert('Error al guardar el producto.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error inesperado al guardar.');
    }
  });


   /* const nombre = document.getElementById('nombreP').value.trim();
    const precio = document.getElementById('Precio').value.trim();
    const cantidad = document.getElementById('Cantidad').value.trim();
    const descripcion = document.getElementById('des').value.trim();
    const proveedor = document.getElementById('Proveedor').value.trim();
    const categoria = document.getElementById('categoria').value;
    const imagen = document.getElementById('imagen').files[0];

    // Validaciones
    if (!nombre || !precio || !cantidad || !descripcion || !proveedor || !categoria || !imagen) {
        alert('Todos los campos son obligatorios.');
        e.preventDefault();
        return;
    }

    if (isNaN(precio) || parseFloat(precio) <= 0) {
        alert('El precio debe ser un número positivo.');
        e.preventDefault();
        return;
    }

    if (!Number.isInteger(Number(cantidad)) || parseInt(cantidad) < 1) {
        alert('La cantidad debe ser un número entero mayor a 0.');
        e.preventDefault();
        return;
    }*/
