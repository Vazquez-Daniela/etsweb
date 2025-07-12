
  document.getElementById('formProducto').addEventListener('submit', async function (e) {
  e.preventDefault();

  // Obtener datos del formulario
  const nombre = document.getElementById('nombreP').value.trim();
  const precio = document.getElementById('Precio').value.trim();
  const cantidad = document.getElementById('Cantidad').value.trim();
  const descripcion = document.getElementById('des').value.trim();
  const categoria = document.getElementById('categoria').value;
  const imagen = document.getElementById('imagen').files[0];

  const proveedor = localStorage.getItem('Proveedor');

  // Validaciones
  if (!nombre || !precio || !cantidad || !descripcion || !proveedor || !categoria || !imagen) {
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

  // Crear FormData y agregar campos
  const formData = new FormData();
  formData.append('nombreP', nombre);
  formData.append('Precio', precio);
  formData.append('Cantidad', cantidad);
  formData.append('des', descripcion);
  formData.append('Proveedor', proveedor); // ← vendedor automático
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
