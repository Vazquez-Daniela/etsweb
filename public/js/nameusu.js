
  // Mostrar nombre del usuario
fetch('/session-usuario')
  .then(res => {
    if (!res.ok) throw new Error("Error de red o sesión");
    return res.json();
  })
  .then(data => {
    console.log("🔍 Respuesta del servidor:", data);
    if (data.nombre) {
      document.getElementById('nombre-usuario-label').textContent = data.nombre;
      localStorage.setItem('usuario', data.nombre);
      console.log("Usuario guardado en localStorage:", data.nombre);
    } else {
      console.warn("No se recibió un nombre desde sesión.");
    }
  })
  .catch(error => {
    console.error("Error en fetch /session-usuario:", error);
  });

  // Cerrar sesión al hacer clic en el submenú
  document.getElementById('cerrar-sesion').addEventListener('click', (e) => {
    e.preventDefault();
    fetch('/logout', { method: 'POST' })
      .then(() => {
        window.location.href = '/Ingresar.html'; // Redirigir al login
      });
  });

