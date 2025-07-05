
    const nombre = document.getElementById("name").value;
    const apelli = document.getElementById("apelli").value;
    const telefono = document.getElementById("telefono").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const t_usuario = document.getElementById("t_usuario").value;

    const response = await fetch("http://localhost:3000/api/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombre,
            apelli,
            telefono,
            email,
            password,
            t_usuario
        })
    });

    const data = await response.json();
    alert(data.message);



