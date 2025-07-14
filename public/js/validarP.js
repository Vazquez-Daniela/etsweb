  document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formProducto');

  if (!form) {
    console.warn("No se encontró el formulario con ID 'formProducto'.");
    return;
  }

  form.addEventListener('submit', function (e) {
    const nombre = document.getElementById('nombreP').value.trim();
    const precio = document.getElementById('Precio').value.trim();
    const cantidad = document.getElementById('Cantidad').value.trim();
    const descripcion = document.getElementById('des').value.trim();
    const categoria = document.getElementById('categoria').value;
    const imagenInput = document.getElementById('imagen');
    const proveedor = localStorage.getItem('usuario');

    // Verifica que el usuario esté autenticado
    if (!proveedor) {
      alert('No se detectó el usuario autenticado.');
      e.preventDefault();
      return;
    }

    // Asigna el proveedor al campo oculto
    document.getElementById('Proveedor').value = proveedor;
    console.log("Proveedor confirmado al enviar:", proveedor);

    // Validación de campos obligatorios
    if (!nombre || !precio || !cantidad || !descripcion || !categoria || !imagenInput.files[0]) {
      alert('Todos los campos son obligatorios.');
      e.preventDefault();
      return;
    }

    // Validación de tipo de datos
    if (isNaN(precio) || parseFloat(precio) <= 0) {
      alert('El precio debe ser un número positivo.');
      e.preventDefault();
      return;
    }

    if (!Number.isInteger(Number(cantidad)) || parseInt(cantidad) <= 0) {
      alert('La cantidad debe ser un número entero mayor a 0.');
      e.preventDefault();
      return;
    }

    // Todo válido, se permite enviar el formulario
    console.log("Formulario listo para enviar.");
  });
});
