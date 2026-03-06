
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Mobile dropdown toggle
document.querySelectorAll('.has-dropdown > a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const parent = link.parentElement;
            parent.classList.toggle('open');
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navCenter = document.querySelector('.nav-center');
    if (hamburger && navCenter) {
        hamburger.addEventListener('click', () => {
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', String(!expanded));
            navCenter.classList.toggle('active');
        });
    }

    document.querySelectorAll('.has-dropdown > a').forEach(link => {
        link.addEventListener('click', e => {
            if (window.matchMedia('(max-width: 855px)').matches) {
                e.preventDefault();
                link.parentElement.classList.toggle('open');
            }
        });
    });
});