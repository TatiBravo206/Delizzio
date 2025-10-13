
(() => {
    // Año dinámico 
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Favoritos con LocalStorage
    const LS_KEY = 'cooky_favs_v1';
    const favBtns = document.querySelectorAll('.fav-btn');
    const getFavs = () => JSON.parse(localStorage.getItem(LS_KEY) || '[]'); // lee los favoritos guardados
    const setFavs = (favs) => localStorage.setItem(LS_KEY, JSON.stringify(favs)); // guarda los favoritos
    let favs = getFavs();
    // Recorre todos los botones de favorito y actualiza su estado
    const updateFavButtons = () => {
        favBtns.forEach(btn => {
            const isFav = favs.includes(btn.dataset.id);
            btn.textContent = isFav ? '♥ Favorito' : '♡ Favorito';
            btn.setAttribute('aria-pressed', isFav);
            btn.classList.toggle('is-fav', isFav);
        });
    };
    // se guarda los favoritos si se vuelve a cargar la pagina
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

    // Cerrar menú en móvil 
    const menuToggle = document.getElementById('menu-toggle');
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle?.checked) menuToggle.checked = false;
        });
    });
})();