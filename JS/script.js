(() => {
    // Año dinámico
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // FAVORITOS CON LOCALSTORAGE
    const LS_KEY = 'cooky_favs_v1';
    const getFavs = () => JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    const setFavs = (favs) => localStorage.setItem(LS_KEY, JSON.stringify(favs));
    let favs = getFavs();

    const updateFavButtons = () => {
        document.querySelectorAll('.fav-btn').forEach(btn => {
            const isFav = favs.some(f => f.id === btn.dataset.id);
            btn.textContent = isFav ? '♥ Favorito' : '♡ Favorito';
            btn.setAttribute('aria-pressed', isFav);
            btn.classList.toggle('is-fav', isFav);
        });
    };

    document.addEventListener('click', e => {
        const btn = e.target.closest('.fav-btn');
        if (!btn) return;

        const id = btn.dataset.id;
        const card = btn.closest('.recipe-card');
        const titulo = card.querySelector('h3').textContent;
        const meta = card.querySelector('.meta').textContent;
        const imagen = card.querySelector('img').src;
        const categoria = card.dataset.cat || 'General';

        if (favs.some(f => f.id === id)) {
            // Eliminar de favoritos
            favs = favs.filter(f => f.id !== id);
        } else {
            // Agregar nuevo favorito
            favs.push({ id, titulo, meta, imagen, categoria });
        }

        setFavs(favs);
        updateFavButtons();
    });

    updateFavButtons();


    // FILTROS DE CATEGORÍAS 
    let filtroActivo = 'all';

    const aplicarFiltro = () => {
        document.querySelectorAll('.recipe-card').forEach(card => {
            const show = filtroActivo === 'all' || card.dataset.cat === filtroActivo;
            card.style.display = show ? '' : 'none';
        });
    };

    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            filtroActivo = chip.dataset.cat;
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            aplicarFiltro(); 
        });
    });

    //PERFIL DE USUARIO
    const usuario = localStorage.getItem("usuarioLogueado");
    const botonLogin = document.getElementById("botonLogin");
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.querySelector(".nav");
    const perfilUsuarioBox = document.getElementById("perfilUsuario");
    const nombreUsuarioSpan = document.getElementById("nombreUsuario");
    const menuPerfilDiv = document.getElementById("menuPerfil");
    const cerrarSesionBtn = document.getElementById("cerrarSesion");

    if (usuario && perfilUsuarioBox && nombreUsuarioSpan && menuPerfilDiv) {
        if (botonLogin) botonLogin.style.display = "none";
        nombreUsuarioSpan.textContent = usuario;
        perfilUsuarioBox.style.display = "flex";

        perfilUsuarioBox.addEventListener("click", (e) => {
            if (menuPerfilDiv.style.display === "flex") {
                menuPerfilDiv.style.display = "none";
            } else {
                menuPerfilDiv.style.display = "flex";
            }
        });

        // Cerrar el menú si se hace clic fuera
        document.addEventListener("click", (e) => {
            //  Perfil de Usuario
            if (!perfilUsuarioBox.contains(e.target) && menuPerfilDiv.style.display === "flex") {
                menuPerfilDiv.style.display = "none";
            }
            // Menú Hamburguesa
            if (menuToggle.checked && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.checked = false;
            }
        });

        // Cerrar sesión
        if (cerrarSesionBtn) {
            cerrarSesionBtn.addEventListener("click", () => {
                localStorage.removeItem("usuarioLogueado");
                window.location.reload();
            });
        }
    }

    // Cargar y mostrar las recetas guardadas por los usuarios
    document.addEventListener("DOMContentLoaded", () => {
        const recetasContainer = document.getElementById("recetasContainer");
        const recetas = JSON.parse(localStorage.getItem("recetas") || '[]');
        if (recetas.length === 0) {
            recetasContainer.innerHTML = "<p></p>";
            return;
        }
        recetas.forEach(r => {
            const card = document.createElement("article");
            card.className = "recipe-card";
            card.dataset.cat = r.categoria || "General"; 
            card.innerHTML = `
                <div class="thumb">
                    <img src="${r.imagen}" alt="${r.titulo}">
                </div>
                <div class="card-body">
                    <h3>${r.titulo}</h3>
                    <p class="meta">${r.tiempo} · ${r.categoria}</p>
                    <div class="card-actions">
                        <button class="fav-btn" data-id="${r.titulo}">♡ Favorito</button>
                        <a href="#" class="btn small">Ver receta</a>
                    </div>
                </div>
            `;
            recetasContainer.appendChild(card);
            aplicarFiltro(); 

        });

    });


    // MODAL DE RECETA 
    const modal = document.getElementById("recipeModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalTime = document.getElementById("modalTime");
    const modalCategory = document.getElementById("modalCategory");
    const modalImage = document.getElementById("modalImage");
    const modalIngredients = document.getElementById("modalIngredients");
    const modalSteps = document.getElementById("modalSteps");
    const closeModalBtn = document.getElementById("closeModal");

    document.addEventListener("click", (e) => {
        if (e.target.matches(".btn.small")) {
            e.preventDefault();
            const card = e.target.closest(".recipe-card");
            const receta = {
                titulo: card.querySelector("h3").textContent,
                meta: card.querySelector(".meta").textContent,
                imagen: card.querySelector("img").src,
                categoria: card.dataset.cat || "General",
                tiempo: card.querySelector(".meta").textContent.split(" · ")[0],
                ingredientes: JSON.parse(card.dataset.ingredientes || "[]"),
                pasos: JSON.parse(card.dataset.pasos || "[]")
            };
            modalTitle.textContent = receta.titulo;
            modalTime.textContent = receta.tiempo;
            modalCategory.textContent = receta.categoria;
            modalImage.src = receta.imagen;

            modalIngredients.innerHTML = "";
            receta.ingredientes.forEach(i => {
                const li = document.createElement("li");
                li.textContent = i;
                modalIngredients.appendChild(li);
            });

            modalSteps.innerHTML = "";
            receta.pasos.forEach(p => {
                const li = document.createElement("li");
                li.textContent = p;
                modalSteps.appendChild(li);
            });

            modal.style.display = "flex";
        }
    });

    closeModalBtn.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

    // BUSCADOR DE RECETAS 
    const buscadorInput = document.getElementById('buscadorInput');
    const btnBuscar = document.getElementById('btnBuscar');
    const recetasContainers = [
        document.getElementById('recipes-grid'),
        document.getElementById('recetasContainer')
    ];

    function filtrarRecetas() {
        const termino = buscadorInput.value.trim().toLowerCase();

        recetasContainers.forEach(container => {
            if (!container) return;

            container.querySelectorAll('.recipe-card').forEach(card => {
                const titulo = card.querySelector('h3')?.textContent.toLowerCase() || "";
                const meta = card.querySelector('.meta')?.textContent.toLowerCase() || "";
                const categoria = card.dataset.cat?.toLowerCase() || "";

                const coincide =
                    titulo.includes(termino) ||
                    meta.includes(termino) ||
                    categoria.includes(termino);

                card.style.display = coincide || termino === "" ? "" : "none";
            });
        });
    }

    // Buscar al presionar Enter o clic en el botón
    if (buscadorInput && btnBuscar) {
        buscadorInput.addEventListener('input', filtrarRecetas);
        btnBuscar.addEventListener('click', (e) => {
            e.preventDefault();
            filtrarRecetas();

            const recetasSection = document.getElementById('recipes');
            if (recetasSection) {
                recetasSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }


})();
