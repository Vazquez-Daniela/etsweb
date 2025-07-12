
  // Mostrar nombre del usuario
 etch('/session-usuario')
    .then(res => res.json())
    .then(data => {
      if (data.nombre) {
        localStorage.setItem('usuario', data.nombre);
        document.getElementById('nombre-usuario-label').textContent = data.nombre;
      } else {
        console.log('No hay sesión activa');
      }
    });

  // Cerrar sesión al hacer clic en el submenú
  document.getElementById('cerrar-sesion').addEventListener('click', (e) => {
    e.preventDefault();
    fetch('/logout', { method: 'POST' })
      .then(() => {
        window.location.href = '/Ingresar.html'; // Redirigir al login
      });
  });

