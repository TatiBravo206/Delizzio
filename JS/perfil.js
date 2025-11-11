//usuario logueado
const usuario = localStorage.getItem("usuarioLogueado");
const cerrarSesionBtn = document.getElementById("cerrarSesion");

if (!usuario) {
    alert("Debes iniciar sesión para acceder a esta página");
    window.location.href = "Login.html";
} else {
    // Mostrar el nombre en el H1 de la sección principal
    document.getElementById("usuarioNombre").textContent = usuario;

    const perfilUsuarioBox = document.getElementById("perfilUsuario");
    const menuPerfilDiv = document.getElementById("menuPerfil");

    document.getElementById("nombreUsuario").textContent = usuario;

    if (perfilUsuarioBox && menuPerfilDiv) {
        perfilUsuarioBox.style.display = "flex";

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
    }

    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener("click", () => {
            localStorage.removeItem("usuarioLogueado");
            window.location.reload();
        });
    }
}

//  MANEJO DEL FORMULARIO 
const recetasContainer = document.getElementById('misRecetas');
const preview = document.getElementById('preview');
const form = document.getElementById('formReceta');
let imagenDataURL = '';

// Imagen previsualizada
const inputImagen = document.getElementById('imagen');
if (inputImagen) {
    inputImagen.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagenDataURL = e.target.result;
                if (preview) {
                    preview.innerHTML = `<img src="${imagenDataURL}" alt="Previsualización" style="max-width:150px; border-radius:8px;">`;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Envío del formulario
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const usuario = localStorage.getItem("usuarioLogueado") || "Anónimo";

    const receta = {
        usuario,
        titulo: this.querySelector('#titulo').value,
        descripcion: this.querySelector('#descripcion').value,
        ingredientes: this.querySelector('#ingredientes').value.split(",").map(i => i.trim()),
        pasos: this.querySelector('#pasos').value,
        porciones: this.querySelector('#porciones').value,
        tiempo: this.querySelector('#tiempo').value,
        dificultad: this.querySelector('#dificultad').options[this.querySelector('#dificultad').selectedIndex].text,
        categoria: this.querySelector('#categoria').options[this.querySelector('#categoria').selectedIndex].text,
        imagen: imagenDataURL || "img/default.jpg"
    };

    // Guardar receta en localStorage
    const recetas = JSON.parse(localStorage.getItem('recetas') || '[]');
    recetas.push(receta);
    localStorage.setItem('recetas', JSON.stringify(recetas));

    mostrarRecetas(); 
    this.reset();
    if (preview) preview.innerHTML = '';
    imagenDataURL = '';
});

// Mostrar recetas
function mostrarRecetas() {
    const recetas = JSON.parse(localStorage.getItem('recetas') || '[]');
    const usuario = localStorage.getItem("usuarioLogueado") || "Anónimo";
    const misRecetas = recetas.filter(r => r.usuario === usuario);
    recetasContainer.innerHTML = '';

    if (misRecetas.length === 0) {
        recetasContainer.innerHTML = "<p>Aún no has subido recetas</p>";
        return;
    }

    misRecetas.forEach(r => {
        const card = document.createElement("article");
        card.className = "recipe-card";
        card.dataset.cat = r.categoria;
        card.innerHTML = `
            <div class="thumb"><img src="${r.imagen}" alt="${r.titulo}"></div>
            <div class="card-body">
                <h3>${r.titulo}</h3>
                <p class="meta">${r.tiempo} · ${r.categoria}</p>
                <div class="card-actions">
                    <button class="btn verReceta">Ver receta</button>
                    <button class="btn borrarReceta">Eliminar</button>
                </div>
            </div>
        `;

        recetasContainer.appendChild(card);

        // Botón eliminar
        card.querySelector(".borrarReceta").addEventListener("click", () => {
            const index = recetas.findIndex(x => x === r);
            if (index > -1) {
                recetas.splice(index, 1);
                localStorage.setItem("recetas", JSON.stringify(recetas));
                mostrarRecetas();
            }
        });

        // Botón ver receta 
        card.querySelector(".verReceta").addEventListener("click", () => {
            const modal = document.getElementById("recipeModal");
            modal.style.display = "flex";
            document.getElementById("modalImage").src = r.imagen;
            document.getElementById("modalTitle").textContent = r.titulo;
            document.getElementById("modalTime").textContent = r.tiempo;
            document.getElementById("modalCategory").textContent = r.categoria;
            document.getElementById("modalDescription").textContent = r.descripcion;
            document.getElementById("modalServings").textContent = r.porciones;
            document.getElementById("modalDifficulty").textContent = r.dificultad;

            const listaIng = document.getElementById("modalIngredients");
            listaIng.innerHTML = '';
            r.ingredientes.forEach(ing => {
                const li = document.createElement('li');
                li.textContent = ing.trim();
                listaIng.appendChild(li);
            });

            const pasosOl = document.getElementById("modalSteps");
            pasosOl.innerHTML = '';
            r.pasos.split("\n").forEach(paso => {
                if (paso.trim() !== '') {
                    const li = document.createElement('li');
                    li.textContent = paso.trim();
                    pasosOl.appendChild(li);
                }
            });
        });
    });
}

// Inicializar recetas al cargar
mostrarRecetas();

// Cierre modal
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("recipeModal").style.display = "none";
});
window.addEventListener("click", e => {
    if (e.target.id === "recipeModal") {
        document.getElementById("recipeModal").style.display = "none";
    }
});
