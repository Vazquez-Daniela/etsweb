
    const nombre = document.getElementById('nombreP').value.trim();
    const precio = document.getElementById('Precio').value.trim();
    const cantidad = document.getElementById('Cantidad').value.trim();
    const descripcion = document.getElementById('des').value.trim();
    const proveedor = document.getElementById('Proveedor').value.trim();
    const categoria = document.getElementById('categoria').value;
    const imagen = document.getElementById('imagen').value.trim();

    // Validaciones
    if (!nombre || !precio || !cantidad || !descripcion || !proveedor || !categoria) {
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
    }
