document.addEventListener('DOMContentLoaded', function () {

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu-1');

    /* =============================
       TOGGLE MENU (CLICK)
    ============================== */
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !expanded);
    });

    /* =============================
       MOBILE DROPDOWN
    ============================== */
    document.querySelectorAll('.has-dropdown-1 > a').forEach(link => {
        link.addEventListener('click', e => {

            if (window.matchMedia('(max-width: 855px)').matches) {
                e.preventDefault();
                link.parentElement.classList.toggle('open');
            }
        });
    });

    /* =============================
       SWIPE TO CLOSE
    ============================== */
    let startX = 0;
    let startY = 0;

    navMenu.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    navMenu.addEventListener('touchend', (e) => {
        let endX = e.changedTouches[0].clientX;
        let endY = e.changedTouches[0].clientY;

        let diffX = startX - endX;
        let diffY = startY - endY;

        if (diffX > 50 || diffY > 50) {
            closeMenu();
        }
    });

    function closeMenu() {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    /* =============================
       SWIPE FROM EDGE TO OPEN
    ============================== */
    let edgeStartX = 0;

    document.addEventListener('touchstart', (e) => {
        edgeStartX = e.touches[0].clientX;
    });

    document.addEventListener('touchend', (e) => {
        let endX = e.changedTouches[0].clientX;

        // Swipe right from LEFT EDGE
        if (edgeStartX < 30 && endX - edgeStartX > 70) {
            navMenu.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
        }
    });

});