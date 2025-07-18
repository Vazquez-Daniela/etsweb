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

   
    if (!proveedor) {
      alert('No se detectó el usuario autenticado.');
      e.preventDefault();
      return;
    }

    // Asigna el nombre del usuario al campo oculto
    document.getElementById('Proveedor').value = proveedor;
    console.log("Proveedor confirmado al enviar:", proveedor);

  
    if (!nombre || !precio || !cantidad || !descripcion || !categoria || !imagenInput.files[0]) {
      alert('Todos los campos son obligatorios.');
      e.preventDefault();
      return;
    }

    
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

    console.log("Formulario listo para enviar.");
  });
});
