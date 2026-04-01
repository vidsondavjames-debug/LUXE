// =============================
// GLOBAL APP LOGIC (FIXED)
// =============================

document.addEventListener('DOMContentLoaded', function () {

    /* =============================
       NAVBAR
    ============================= */

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu-1');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !expanded);
        });
    }

    document.querySelectorAll('.has-dropdown-1 > a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.matchMedia('(max-width: 855px)').matches) {
                e.preventDefault();
                link.parentElement.classList.toggle('open');
            }
        });
    });

    // Swipe to close navbar (mobile)
    let startX = 0;
    let startY = 0;

    document.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    document.addEventListener("touchmove", (e) => {
        if (!navMenu.classList.contains("active")) return;

        let diffX = Math.abs(e.touches[0].clientX - startX);
        let diffY = Math.abs(e.touches[0].clientY - startY);

        if (diffX > 30 || diffY > 30) {
            navMenu.classList.remove("active");
            hamburger.setAttribute("aria-expanded", false);
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

    let currentProduct = null;

    document.querySelectorAll(".view-btn").forEach((btn, index) => {
        btn.addEventListener("click", () => {

            modal.style.display = "block";

            const priceNumber = Number(btn.dataset.price.replace('$', ''));

            currentProduct = {
                id: Number(btn.dataset.id),
                name: btn.dataset.title,
                price: priceNumber,
                img: btn.dataset.img
            };

            modalImg.src = currentProduct.img;
            modalTitle.textContent = currentProduct.name;
            modalDesc.textContent = btn.dataset.desc;
            modalPrice.textContent = "$" + currentProduct.price;
        });
    });

    document.querySelector(".close-modal")?.addEventListener("click", () => {
        modal.style.display = "none";
    });

    document.querySelector(".modal-overlay")?.addEventListener("click", () => {
        modal.style.display = "none";
    });

    /* =============================
       CART FUNCTION
    ============================= */

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ ...product, qty: 1 });
        }

        localStorage.setItem("cartItems", JSON.stringify(cart));
        updateCartCount();
        showToast("Added to cart 🛒");
    }

    document.querySelector(".add-to-cart-btn")?.addEventListener("click", () => {
        if (currentProduct) addToCart(currentProduct);
    });

    /* =============================
       WISHLIST FUNCTION
    ============================= */

    function addToWishlist(product) {
        let wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];

        const existing = wishlist.find(item => item.id === product.id);

        if (!existing) {
            wishlist.push(product);
            localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
            updateWishlistCount();
            showToast("Added to wishlist ❤️");
        } else {
            showToast("Already in wishlist ❤️");
        }
    }

    document.querySelector(".add-to-wishlist")?.addEventListener("click", () => {
        if (currentProduct) addToWishlist(currentProduct);
    });

    // 🔥 UPDATE COUNTS ON LOAD
    updateCartCount();
    updateWishlistCount();

});


// =============================
// CART PAGE LOGIC (READS LOCAL STORAGE)
// =============================

document.addEventListener("DOMContentLoaded", () => {

    const cartContainer = document.getElementById("cart-items");
    if (!cartContainer) return;

    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

    function saveCart() {
        localStorage.setItem("cartItems", JSON.stringify(cart));
    }

    function renderCart() {
        cart = JSON.parse(localStorage.getItem("cartItems")) || [];
        cartContainer.innerHTML = "";

        cart.forEach(item => {
            const div = document.createElement("div");
            div.className = "card";

            div.innerHTML = `
                <img src="${item.img}" />
                <div class="details">
                  <h3>${item.name}</h3>
                  <p class="price">$${item.price}</p>
                  <div class="qty">
                    <button data-id="${item.id}" class="decrease">-</button>
                    <span>${item.qty}</span>
                    <button data-id="${item.id}" class="increase">+</button>
                  </div>
                </div>
                <div class="remove" data-id="${item.id}">✕</div>
            `;

            cartContainer.appendChild(div);
        });

        attachEvents();
        updateTotal();
        updateCartCount();
        saveCart();
    }

    function attachEvents() {
        document.querySelectorAll(".increase").forEach(btn => {
            btn.onclick = () => {
                const item = cart.find(i => i.id == btn.dataset.id);
                item.qty++;
                saveCart();
                renderCart();
            };
        });

        document.querySelectorAll(".decrease").forEach(btn => {
            btn.onclick = () => {
                const item = cart.find(i => i.id == btn.dataset.id);
                if (item.qty > 1) item.qty--;
                saveCart();
                renderCart();
            };
        });

        document.querySelectorAll(".remove").forEach(btn => {
            btn.onclick = () => {
                cart = cart.filter(i => i.id != btn.dataset.id);
                saveCart();
                renderCart();
            };
        });
    }

    function updateTotal() {
        let subtotal = 0;
        cart.forEach(item => subtotal += item.price * item.qty);

        document.getElementById("subtotal").innerText = "$" + subtotal;
        document.getElementById("total").innerText = "$" + (subtotal + 10);
    }

    renderCart();
});


// =============================
// WISHLIST PAGE LOGIC
// =============================

document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("wishlist-items");
    if (!container) return;

    let wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];

    function saveWishlist() {
        localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
    }

    function renderWishlist() {
        wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];
        container.innerHTML = "";

        if (wishlist.length === 0) {
            container.innerHTML = "<p>Your wishlist is empty.</p>";
            updateWishlistCount();
            return;
        }

        wishlist.forEach(item => {
            const div = document.createElement("div");
            div.className = "card";

            div.innerHTML = `
                <img src="${item.img}" />
                <div class="details">
                  <h3>${item.name}</h3>
                  <p class="price">$${item.price}</p>
                  <div class="actions">
                    <button class="add-cart" data-id="${item.id}">Add to Cart</button>
                    <button class="remove" data-id="${item.id}">Remove</button>
                  </div>
                </div>
            `;

            container.appendChild(div);
        });

        attachEvents();
        updateWishlistCount();
        saveWishlist();
    }

    function attachEvents() {

        document.querySelectorAll(".add-cart").forEach(btn => {
            btn.onclick = () => {
                const item = wishlist.find(i => i.id == btn.dataset.id);

                let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

                const existing = cart.find(c => c.id === item.id);
                if (existing) existing.qty++;
                else cart.push({ ...item, qty: 1 });

                localStorage.setItem("cartItems", JSON.stringify(cart));

                wishlist = wishlist.filter(i => i.id != item.id);
                saveWishlist();
                renderWishlist(updateWishlistCount()
                );
                updateCartCount();
            };
        });

        document.querySelectorAll(".remove").forEach(btn => {
            btn.onclick = () => {
                wishlist = wishlist.filter(i => i.id != btn.dataset.id);
                saveWishlist();
                renderWishlist();
            };
        });
    }

    renderWishlist();
});

// =============================
// GLOBAL COUNT FUNCTIONS
// =============================

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const total = cart.reduce((sum, item) => sum + item.qty, 0);

    const el = document.getElementById("cart-count");
    if (el) el.innerText = total;
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];

    const el = document.getElementById("wishlist-count");
    if (el) el.innerText = wishlist.length;
}

// =============================
// ALERT FUNCTION (FIXED OVERRIDE)
// =============================

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

window.addEventListener("storage", () => {
    updateCartCount();
    updateWishlistCount();

    if (typeof renderCart === "function") {
        renderCart();
    }

    if (typeof renderWishlist === "function") {
        renderWishlist();
    }
});