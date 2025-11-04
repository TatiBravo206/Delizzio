// Mostrar usuario logueado
const usuario = localStorage.getItem("usuarioLogueado");
const cerrarSesionBtn = document.getElementById("cerrarSesion");

if (!usuario) {
    // Si no está logueado, redirige
    alert("Debes iniciar sesión para acceder a esta página");
    window.location.href = "Login.html";
} else {
    // Mostrar el nombre en el H1 de la sección principal
    document.getElementById("usuarioNombre").textContent = usuario;

    // Mostrar el nombre en el avatar del header
    const perfilUsuarioBox = document.getElementById("perfilUsuario");
    const menuPerfilDiv = document.getElementById("menuPerfil");

    document.getElementById("nombreUsuario").textContent = usuario;
    
    if (perfilUsuarioBox && menuPerfilDiv) {
        // Muestra el perfil si estaba oculto por CSS
        perfilUsuarioBox.style.display = "flex";

        perfilUsuarioBox.addEventListener("click", (e) => {
            e.stopPropagation(); 
            if (menuPerfilDiv.style.display === "flex") {
                menuPerfilDiv.style.display = "none";
            } else {
                menuPerfilDiv.style.display = "flex";
            }
        });
        
        // Cierra el menú si se hace clic fuera
        document.addEventListener("click", () => {
             if (menuPerfilDiv.style.display === "flex") {
                menuPerfilDiv.style.display = "none";
            }
        });
    }

    // Cerrar sesión
        if (cerrarSesionBtn) {
            cerrarSesionBtn.addEventListener("click", () => {
                localStorage.removeItem("usuarioLogueado");
                window.location.reload();
            });
        }
}

// Función para renderizar recetas del usuario
function mostrarRecetas() {
    const recetas = JSON.parse(localStorage.getItem("recetas") || '[]');
    const misRecetas = recetas.filter(r => r.usuario === usuario);
    const contenedor = document.getElementById("misRecetas");
    contenedor.innerHTML = "";

    if(misRecetas.length === 0){
        contenedor.innerHTML = "<p>Aún no has subido recetas</p>";
        return;
    }

    misRecetas.forEach(r => {
        const card = document.createElement("article");
        card.className = "recipe-card";
        card.innerHTML = `
            <div class="thumb"><img src="${r.imagen}" alt="${r.titulo}"></div>
            <div class="card-body">
                <h3>${r.titulo}</h3>
                <p>${r.descripcion}</p>
                <p class="meta">${r.tiempo} · ${r.categoria}</p>
                <button class="btn borrarReceta">Eliminar</button>
            </div>
        `;
        contenedor.appendChild(card);

        // Eliminar receta
        card.querySelector(".borrarReceta").addEventListener("click", () => {
            const index = recetas.findIndex(x => x === r);
            if(index > -1){
                recetas.splice(index, 1);
                localStorage.setItem("recetas", JSON.stringify(recetas));
                mostrarRecetas();
            }
        });
    });
}

// Manejo del formulario
document.getElementById("formReceta").addEventListener("submit", function(e){
    e.preventDefault();

    const receta = {
        usuario,
        titulo: this.titulo.value,
        descripcion: this.descripcion.value,
        ingredientes: this.ingredientes.value.split(","),
        pasos: this.pasos.value,
        imagen: this.imagen.value || "img/default.jpg",
        categoria: this.categoria.value,
        tiempo: this.tiempo.value
    };

    const recetas = JSON.parse(localStorage.getItem("recetas") || '[]');
    recetas.push(receta);
    localStorage.setItem("recetas", JSON.stringify(recetas));

    alert("Receta subida!");
    this.reset();
    mostrarRecetas();
});

// Inicializar recetas
mostrarRecetas();
