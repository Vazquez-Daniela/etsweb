document.getElementById('formProducto').addEventListener('submit', (e) => {
  const proveedor = localStorage.getItem('usuario');
  if (!proveedor) {
    alert('No se detectó el usuario autenticado.');
    e.preventDefault();
    return;
  }

  document.getElementById('Proveedor').value = proveedor;
  console.log("Proveedor confirmado al enviar:", proveedor);
});

   /*  document.getElementById('formProducto').addEventListener('submit', () => {
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        document.getElementById('Proveedor').value = usuario;
        console.log("✅ Proveedor insertado al enviar:", usuario);
      }
    });*/