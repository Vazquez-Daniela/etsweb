document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = {
    usuario: formData.get('email'),
    contraseña: formData.get('password')
  };

  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const mensaje = document.getElementById('mensaje');

  if (response.ok) {
    const res = await response.json();
    mensaje.textContent = res.mensaje;

    // Redireccionar según tipo de usuario
    if (res.tipoUsuario === 'cliente') {
      window.location.href = '/Inicio.html';
    } else if (res.tipoUsuario === 'vendedor') {
      window.location.href = '/vendedorI.html';
    }
  } else {
    const res = await response.json();
    mensaje.textContent = res.mensaje;
  }
});
