document.getElementById("formulario").addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Obtener los valores
    const usuario = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const email = document.getElementById("email").value; 

    // Guardamos usuario, pass y email
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    
    if (usuarios.find(u => u.usuario === usuario)) {
        alert("Este nombre de usuario ya existe, intenta con otro.");
        return;
    }
    if (usuarios.find(u => u.email === email)) {
        alert("Este correo electrónico ya está registrado.");
        return;
    }

    // Guardar el nuevo usuario
    usuarios.push({ usuario, pass, email });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("¡Registro exitoso! Ya puedes iniciar sesión.");
    window.location.href = "Login.html";
});