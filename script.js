

// DOM Ready
// Handles hamburger menu

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu-1');

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', String(!expanded));
        navMenu.classList.toggle('active');
    });

    // Mobile dropdown toggle
    document.querySelectorAll('.has-dropdown-1 > a').forEach(link => {
        link.addEventListener('click', e => {
            if (window.matchMedia('(max-width: 855px)').matches) {
                e.preventDefault();
                link.parentElement.classList.toggle('open');
            }
        });
    });
});

// Product Modal Logic

const modal = document.getElementById("productModal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalPrice = document.getElementById("modalPrice");

document.querySelectorAll(".view-btn").forEach(btn => {

    btn.addEventListener("click", () => {

        modal.style.display = "block";

        modalImg.src = btn.dataset.img;
        modalTitle.textContent = btn.dataset.title;
        modalDesc.textContent = btn.dataset.desc;
        modalPrice.textContent = btn.dataset.price;

    });

});

document.querySelector(".close-modal").onclick = () => {
    modal.style.display = "none";
};

document.querySelector(".modal-overlay").onclick = () => {
    modal.style.display = "none";
};


// Password visibility toggle

function togglePassword(id, icon) {
    const input = document.getElementById(id);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    }
}