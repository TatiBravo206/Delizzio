document.getElementById("loginBtn").addEventListener("click", () => {
  const usuario = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const user = usuarios.find(u => u.usuario === usuario && u.pass === pass);

  if (user) {
    localStorage.setItem("usuarioLogueado", usuario);
    window.location.href = "index.html";
  } else {
    alert("Usuario o contraseña incorrectos");
  }
});


document.getElementById("loginBtn").addEventListener("click", () => {
  const usuario = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (usuario && pass) {
    // Guardamos el usuario en localStorage
    localStorage.setItem("usuarioLogueado", usuario);
    // Redirigimos a la pagina del usuario
    window.location.href = "perfil.html";
  } else {
    alert("Por favor ingresa tus datos");
  }
});
