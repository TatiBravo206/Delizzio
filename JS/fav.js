const usuario = localStorage.getItem("usuarioLogueado");
const cerrarSesionBtn = document.getElementById("cerrarSesion");

if (!usuario) {
  alert("Debes iniciar sesión para acceder a esta página");
  window.location.href = "Login.html";
} else {
  document.getElementById("nombreUsuario").textContent = usuario;

  const perfilUsuarioBox = document.getElementById("perfilUsuario");
  const menuPerfilDiv = document.getElementById("menuPerfil");

  perfilUsuarioBox.addEventListener("click", (e) => {
    e.stopPropagation();
    menuPerfilDiv.style.display =
      menuPerfilDiv.style.display === "flex" ? "none" : "flex";
  });

  document.addEventListener("click", () => {
    if (menuPerfilDiv.style.display === "flex") {
      menuPerfilDiv.style.display = "none";
    }
  });

  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogueado");
      window.location.href = "Login.html";
    });
  }
}

// FAVORITOS 
const LS_KEY = "cooky_favs_v1";
const contenedor = document.getElementById("favoritosContainer");

// Mostrar recetas favoritas
function mostrarFavoritos() {
  const favs = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  contenedor.innerHTML = "";

  if (favs.length === 0) {
    contenedor.innerHTML = `<p style="text-align:left; margin-top:20px;">No tienes recetas favoritas todavía ❤️</p>`;
    return;
  }

  favs.forEach((r) => {
    const card = document.createElement("article");
    card.className = "recipe-card";
    card.innerHTML = `
      <div class="thumb"><img src="${r.imagen}" alt="${r.titulo}"></div>
      <div class="card-body">
        <h3>${r.titulo}</h3>
        <p class="meta">${r.meta}</p>
        <div class="card-actions">
          <button class="fav-btn" data-id="${r.id}">♥ Quitar Favorito</button>
          <a href="#" class="btn small">Ver receta</a>
        </div>
      </div>
    `;
    card.querySelector(".fav-btn").addEventListener("click", () => quitarFavorito(r.id));
    contenedor.appendChild(card);
  });
}

// Quitar receta de favoritos
function quitarFavorito(id) {
  let favs = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  favs = favs.filter(f => f.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(favs));
  mostrarFavoritos();
}

// Mostrar favoritos al cargar
document.addEventListener("DOMContentLoaded", mostrarFavoritos);
