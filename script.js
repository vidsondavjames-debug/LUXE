// =============================
// GLOBAL STATE
// =============================
let currentProduct = null;


// =============================
// INIT
// =============================
document.addEventListener('DOMContentLoaded', () => {
    setupNavbar();
    setupModal();

    renderCart();
    renderWishlist();

    updateCartCount();
    updateWishlistCount();
});


// =============================
// NAVBAR (KEEP YOUR SWIPE)
// =============================
function setupNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu-1');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    navMenu.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    navMenu.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        currentX = e.touches[0].clientX;
        let diff = currentX - startX;

        if (diff < 0) {
            navMenu.style.transform = `translateX(${diff}px)`;
        }
    });

    navMenu.addEventListener('touchend', () => {
        let diff = currentX - startX;

        if (diff < -80) {
            navMenu.classList.remove('active');
        }

        navMenu.style.transform = '';
        isDragging = false;
    });
}


// =============================
// MODAL
// =============================
function setupModal() {
    const modal = document.getElementById("productModal");
    if (!modal) return;

    const overlay = document.querySelector(".modal-overlay");
    const closeBtn = document.querySelector(".close-modal");

    const modalImg = document.getElementById("modalImg");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const modalPrice = document.getElementById("modalPrice");

    document.querySelectorAll(".view-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            currentProduct = {
                id: btn.dataset.id,
                name: btn.dataset.title,
                price: parseFloat(btn.dataset.price.replace("$", "")),
                img: btn.dataset.img
            };

            modalImg.src = currentProduct.img;
            modalTitle.textContent = currentProduct.name;
            modalDesc.textContent = btn.dataset.desc;
            modalPrice.textContent = `$${currentProduct.price}`;

            modal.style.display = "flex";
        });
    });

    const close = () => modal.style.display = "none";

    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", close);
}


// =============================
// CART
// =============================
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

    const existing = cart.find(i => i.id == product.id);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cartItems", JSON.stringify(cart));

    updateCartCount();
    renderCart();

    showToast("Added to cart 🛒");
}

function changeQty(id, change) {
    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

    cart = cart.map(item => {
        if (item.id == id) {
            let newQty = item.qty + change;

            if (newQty < 1) newQty = 1;

            return { ...item, qty: newQty };
        }
        return item;
    });

    localStorage.setItem("cartItems", JSON.stringify(cart));

    renderCart();
    updateCartCount();
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

    cart = cart.filter(item => item.id != id);

    localStorage.setItem("cartItems", JSON.stringify(cart));

    renderCart();
    updateCartCount();

    showToast("Removed from cart ❌");
}

function renderCart() {
    const container = document.getElementById("cart-items");
    if (!container) return;

    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

    container.innerHTML = "";

    let subtotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty</p>";
        return;
    }

    cart.forEach(item => {
        subtotal += item.price * item.qty;
        totalItems += item.qty;

        container.innerHTML += `
        <div class="card">
            <img src="${item.img}" />
            <div class="details">
                <h3>${item.name}</h3>
                <p>$${item.price}</p>

                <div class="qty">
                    <button onclick="changeQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>

            <span class="remove" onclick="removeFromCart(${item.id})">✖</span>
        </div>
        `;
    });

    document.getElementById("subtotal").innerText = `$${subtotal}`;
    document.getElementById("total").innerText = `$${subtotal + 10}`;
    document.getElementById("cart-count").innerText = totalItems;
}


// =============================
// WISHLIST
// =============================
function addToWishlist(product) {
    let wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];

    if (!wishlist.find(i => i.id == product.id)) {
        wishlist.push(product);
        localStorage.setItem("wishlistItems", JSON.stringify(wishlist));

        showToast("Added to wishlist ❤️");
    } else {
        showToast("Already in wishlist");
    }

    updateWishlistCount();
    renderWishlist();
}

function removeFromWishlist(id) {
    let wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];

    wishlist = wishlist.filter(item => item.id != id);

    localStorage.setItem("wishlistItems", JSON.stringify(wishlist));

    renderWishlist();
    updateWishlistCount();

    showToast("Removed from wishlist ❌");
}

function moveToCart(id) {
    let wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    const item = wishlist.find(i => i.id == id);

    if (!item) return;

    addToCart(item);

    // REMOVE AFTER MOVING
    wishlist = wishlist.filter(i => i.id != id);
    localStorage.setItem("wishlistItems", JSON.stringify(wishlist));

    renderWishlist();
    updateWishlistCount();

    showToast("Moved to cart 🛒");
}

function renderWishlist() {
    const container = document.getElementById("wishlist-items");
    if (!container) return;

    let wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];

    container.innerHTML = "";

    if (wishlist.length === 0) {
        container.innerHTML = "<p>Your wishlist is empty</p>";
        return;
    }

    wishlist.forEach(item => {
        container.innerHTML += `
        <div class="card">
            <img src="${item.img}" />
            <div class="details">
                <h3>${item.name}</h3>
                <p>$${item.price}</p>

                <div class="actions">
                    <button class="add-cart" onclick="moveToCart(${item.id})">
                        Add to Cart
                    </button>
                    <button class="remove" onclick="removeFromWishlist(${item.id})">
                        Remove
                    </button>
                </div>
            </div>
        </div>
        `;
    });
}


// =============================
// MODAL BUTTONS
// =============================
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
        if (currentProduct) addToCart(currentProduct);
    }

    if (e.target.classList.contains("add-to-wishlist")) {
        if (currentProduct) addToWishlist(currentProduct);
    }
});


// =============================
// COUNTS
// =============================
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const total = cart.reduce((sum, item) => sum + item.qty, 0);

    const el = document.getElementById("cart-count");
    if (el) el.innerText = total;
}

function updateWishlistCount() {
    let wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];

    const el = document.getElementById("wishlist-count");
    if (el) el.innerText = wishlist.length;
}


// =============================
// TOAST
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


  const slides = [
    {
      title: "LUXURY<br>SHOES",
      desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.",
      price: "$5.59",
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=640&q=80",
      alt: "Grey felt luxury shoes with tan laces"
    },
    {
      title: "URBAN<br>CLASSICS",
      desc: "Timeless silhouettes crafted from full-grain leather for the discerning modern soul.",
      price: "$8.99",
      img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=640&q=80",
      alt: "Classic leather sneaker"
    },
    {
      title: "WEEKEND<br>EDITION",
      desc: "Effortless comfort meets refined style — perfect for every occasion from dusk to dawn.",
      price: "$6.49",
      img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=640&q=80",
      alt: "Casual white lifestyle sneaker"
    }
  ];

  let current = 0;
  let animating = false;
  let autoTimer;

  // Build dots
  const dotsContainer = document.getElementById('dotsContainer');
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(idx) {
    if (animating || idx === current) return;
    animating = true;

    const content = document.querySelector('.hero-content');
    const circle = document.getElementById('heroCircle');

    content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    circle.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    content.style.opacity = '0';
    content.style.transform = 'translateY(12px)';
    circle.style.opacity = '0';
    circle.style.transform = 'scale(0.95)';

    setTimeout(() => {
      current = idx;
      const s = slides[current];
      document.getElementById('slideTitle').innerHTML = s.title;
      document.getElementById('slideDesc').textContent = s.desc;
      document.getElementById('priceBadge').textContent = s.price;
      document.getElementById('slideImg').src = s.img;
      document.getElementById('slideImg').alt = s.alt;

      updateDots();

      content.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      circle.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
      circle.style.opacity = '1';
      circle.style.transform = 'scale(1)';

      animating = false;
    }, 310);
  }

  function changeSlide(dir) {
    goTo((current + dir + slides.length) % slides.length);
  }

  document.getElementById('prevBtn').addEventListener('click', () => changeSlide(-1));
  document.getElementById('nextBtn').addEventListener('click', () => changeSlide(1));

  function startAuto() {
    autoTimer = setInterval(() => changeSlide(1), 4500);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  const hero = document.getElementById('heroSlider');
  hero.addEventListener('mouseenter', stopAuto);
  hero.addEventListener('mouseleave', startAuto);

  startAuto();