 document.addEventListener('DOMContentLoaded', () => {
    const proveedor = localStorage.getItem('usuario');
    if (proveedor) {
      document.getElementById('Proveedor').value = proveedor;
      console.log("proveedor:",proveedor)
    } else {
      console.warn('Usuario no autenticado en localStorage');
    }
  });

   /*  document.getElementById('formProducto').addEventListener('submit', () => {
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        document.getElementById('Proveedor').value = usuario;
        console.log("✅ Proveedor insertado al enviar:", usuario);
      }
    });*/