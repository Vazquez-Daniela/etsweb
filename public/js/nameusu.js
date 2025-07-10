   fetch('/session-usuario')
                 .then(res => res.json())
                 .then(data => {
             if (data.nombre) {
                 const label = document.getElementById('nombre-usuario-label');
                 label.textContent = data.nombre;
                }
            });