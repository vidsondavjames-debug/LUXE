document.addEventListener('DOMContentLoaded', function () {

    /* =============================
       NAVBAR LOGIC
    ============================= */

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu-1');

    // TOGGLE MENU
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !expanded);
    });

    // MOBILE DROPDOWN (MULTIPLE OPEN)
    document.querySelectorAll('.has-dropdown-1 > a').forEach(link => {
        link.addEventListener('click', (e) => {

            if (window.matchMedia('(max-width: 855px)').matches) {
                e.preventDefault();

                const parent = link.parentElement;
                parent.classList.toggle('open');
            }
        });
    });


    /* =============================
       SWIPE MENU (OPEN + CLOSE)
    ============================= */

    let startX = 0;
    let endX = 0;

    // Swipe from LEFT EDGE → OPEN MENU
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    document.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;

        // OPEN MENU
        if (startX < 50 && endX > 100) {
            navMenu.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
        }

        // CLOSE MENU
        if (startX > 100 && endX < 50) {
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });


    /* =============================
       PRODUCT MODAL
    ============================= */

    const modal = document.getElementById("productModal");
    const modalImg = document.getElementById("modalImg");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const modalPrice = document.getElementById("modalPrice");
    const addToCartBtn = document.querySelector(".add-to-cart-btn");

    // OPEN MODAL
    document.querySelectorAll(".view-btn").forEach(btn => {
        btn.addEventListener("click", () => {

            modal.style.display = "block";

            modalImg.src = btn.dataset.img;
            modalTitle.textContent = btn.dataset.title;
            modalDesc.textContent = btn.dataset.desc;
            modalPrice.textContent = btn.dataset.price;
        });
    });

    // CLOSE MODAL
    document.querySelector(".close-modal").addEventListener("click", () => {
        modal.style.display = "none";
    });

    document.querySelector(".modal-overlay").addEventListener("click", () => {
        modal.style.display = "none";
    });

    // ADD TO CART ANIMATION
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            addToCartBtn.classList.add("added-animation");

            setTimeout(() => {
                addToCartBtn.classList.remove("added-animation");
            }, 400);
        });
    }


    /* =============================
       MODAL IMAGE SWIPE
    ============================= */

    let imgStartX = 0;
    let imgEndX = 0;

    if (modalImg) {
        modalImg.addEventListener("touchstart", (e) => {
            imgStartX = e.touches[0].clientX;
        });

        modalImg.addEventListener("touchend", (e) => {
            imgEndX = e.changedTouches[0].clientX;

            let diff = imgStartX - imgEndX;

            if (diff > 50) {
                console.log("Swipe Left");
            } else if (diff < -50) {
                console.log("Swipe Right");
            }
        });
    }

});


/* =============================
   PASSWORD TOGGLE (GLOBAL)
============================= */

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