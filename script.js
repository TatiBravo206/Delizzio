(() => {
    // Año dinámico
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Favoritos con LocalStorage 
    const LS_KEY = 'cooky_favs_v1';
    const favBtns = document.querySelectorAll('.fav-btn');
    const getFavs = () => JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    const setFavs = (favs) => localStorage.setItem(LS_KEY, JSON.stringify(favs));
    let favs = getFavs();

    const updateFavButtons = () => {
        favBtns.forEach(btn => {
            const isFav = favs.includes(btn.dataset.id);
            btn.textContent = isFav ? '♥ Favorito' : '♡ Favorito';
            btn.setAttribute('aria-pressed', isFav);
            btn.classList.toggle('is-fav', isFav);
        });
    };

    favBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            if (!id) return;
            favs = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
            setFavs(favs);
            updateFavButtons();
        });
    });
    updateFavButtons();

    // Filtros de categorías 
    const chips = document.querySelectorAll('.chip');
    const cards = document.querySelectorAll('.recipe-card');

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const cat = chip.dataset.cat;
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            cards.forEach(card => {
                const show = cat === 'all' || card.dataset.cat === cat;
                card.style.display = show ? '' : 'none';
            });
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
        // Ocultar botón de login
        if (botonLogin) botonLogin.style.display = "none";

        // Mostrar nombre del usuario
        nombreUsuarioSpan.textContent = usuario;

        // Mostrar el contenedor del perfil
        perfilUsuarioBox.style.display = "flex"; 

        // Configuración del menú desplegable al hacer clic en el perfil
        perfilUsuarioBox.addEventListener("click", (e) => {
            if (menuPerfilDiv.style.display === "flex") {
                menuPerfilDiv.style.display = "none";
            } else {
                menuPerfilDiv.style.display = "flex";
            }
        });

        // Cerrar el menú si se hace clic fuera 
        document.addEventListener("click", (e) => {
            // 1. Lógica para el Perfil de Usuario
            if (!perfilUsuarioBox.contains(e.target) && menuPerfilDiv.style.display === "flex") {
                menuPerfilDiv.style.display = "none";
            }

            // 2. Lógica para el Menú Hamburguesa
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
})();