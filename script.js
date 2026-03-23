// ============================================================
// NAVBAR — MOBILE MENU
// ============================================================

const navLinks = document.querySelectorAll(".nav-menu .nav-link");
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton.addEventListener("click", () => {
    document.body.classList.toggle("show-mobile-menu");
});

menuCloseButton.addEventListener("click", () => menuOpenButton.click());

navLinks.forEach(link => {
    link.addEventListener("click", () => menuOpenButton.click());
});


// ============================================================
// SWIPER SLIDER
// ============================================================

const swiper = new Swiper(".slider-wrapper", {
    loop: true,
    grabCursor: true,
    spaceBetween: 25,

    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
    },

    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});


// ============================================================
// TOAST NOTIFICATION
// ============================================================

const toastEl = document.getElementById("toast");

function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    setTimeout(() => toastEl.classList.remove("show"), 2600);
}


// ============================================================
// CART — STATE & HELPERS
// ============================================================

let cart = [];

const cartOverlay        = document.getElementById("cart-overlay");
const cartSidebar        = document.getElementById("cart-sidebar");
const cartOpenBtn        = document.getElementById("cart-open-btn");
const cartCloseBtn       = document.getElementById("cart-close-btn");
const cartBadge          = document.getElementById("cart-badge");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartEmptyMsg       = document.getElementById("cart-empty-msg");
const cartFooter         = document.getElementById("cart-footer");
const cartTotalPrice     = document.getElementById("cart-total-price");

function openCart() {
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartUI() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartEmptyMsg.style.display = "block";
        cartFooter.style.display = "none";
        cartBadge.style.display = "none";
    } else {
        cartEmptyMsg.style.display = "none";
        cartFooter.style.display = "block";
        cartBadge.style.display = "flex";
        cartBadge.textContent = getCartCount();
        cartTotalPrice.textContent = "₱" + getCartTotal().toLocaleString();

        cart.forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "cart-item";
            div.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="cart-item-img"
                     onerror="this.src='coffee-hero-section.png'">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₱${item.price} each</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
                        <span class="qty-value">${item.qty}</span>
                        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item-btn" onclick="removeItem(${index})" title="Remove">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            cartItemsContainer.appendChild(div);
        });
    }
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}


// ============================================================
// CART — EVENT LISTENERS
// ============================================================

cartOpenBtn.addEventListener("click", openCart);
cartCloseBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const name  = btn.dataset.name;
        const price = parseInt(btn.dataset.price);
        const img   = btn.dataset.img;

        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ name, price, img, qty: 1 });
        }

        updateCartUI();
        showToast("🛒 " + name + " added to cart!");
    });
});


// ============================================================
// CHECKOUT MODAL — OPEN / CLOSE
// ============================================================

const checkoutOverlay = document.getElementById("checkout-modal-overlay");
const openCheckoutBtn = document.getElementById("open-checkout-btn");
const modalCloseBtn   = document.getElementById("modal-close-btn");
const checkoutSteps   = document.getElementById("checkout-steps");
const modalTitle      = document.getElementById("modal-title");

function openCheckout() {
    goToStep(1);
    checkoutSteps.style.display = "flex";
    modalTitle.innerHTML = '<i class="fas fa-receipt"></i> Checkout';
    checkoutOverlay.classList.add("active");
}

function closeCheckout() {
    checkoutOverlay.classList.remove("active");
}

openCheckoutBtn.addEventListener("click", () => {
    closeCart();
    openCheckout();
});

modalCloseBtn.addEventListener("click", closeCheckout);

checkoutOverlay.addEventListener("click", (e) => {
    if (e.target === checkoutOverlay) {
        closeCheckout();
    }
});


// ============================================================
// CHECKOUT MODAL — STEP NAVIGATION
// ============================================================

function goToStep(step) {
    // Hide all panels
    ["1", "2", "3", "thanks"].forEach(s => {
        document.getElementById("step-panel-" + s).classList.remove("active");
    });

    // Show the target panel
    document.getElementById("step-panel-" + step).classList.add("active");

    // Update step indicators (only for numbered steps)
    [1, 2, 3].forEach(n => {
        const indicator = document.getElementById("step-ind-" + n);
        if (!indicator) return;
        indicator.classList.remove("active", "done");
        if (n < step) indicator.classList.add("done");
        if (n === step) indicator.classList.add("active");
    });
}


// ============================================================
// CHECKOUT MODAL — PAYMENT METHOD SELECTION
// ============================================================

document.querySelectorAll(".payment-option").forEach(option => {
    option.addEventListener("click", () => {
        // Deselect all
        document.querySelectorAll(".payment-option").forEach(o => o.classList.remove("selected"));
        // Select clicked
        option.classList.add("selected");
        option.querySelector("input[type='radio']").checked = true;

        // Hide all detail boxes
        document.getElementById("gcash-details").classList.remove("visible");
        document.getElementById("bank-details").classList.remove("visible");
        document.getElementById("cod-details").classList.remove("visible");

        // Show the relevant detail box
        const value = option.querySelector("input").value;
        if (value === "gcash") document.getElementById("gcash-details").classList.add("visible");
        if (value === "bank")  document.getElementById("bank-details").classList.add("visible");
        if (value === "cod")   document.getElementById("cod-details").classList.add("visible");
    });
});


// ============================================================
// CHECKOUT MODAL — STEP 1: DELIVERY DETAILS → STEP 2
// ============================================================

document.getElementById("step1-next").addEventListener("click", () => {
    const fname    = document.getElementById("fname").value.trim();
    const lname    = document.getElementById("lname").value.trim();
    const phone    = document.getElementById("phone").value.trim();
    const street   = document.getElementById("street").value.trim();
    const city     = document.getElementById("city").value.trim();
    const province = document.getElementById("province").value.trim();

    if (!fname || !lname || !phone || !street || !city || !province) {
        showToast("⚠️ Please fill in all required fields.");
        return;
    }

    goToStep(2);
});


// ============================================================
// CHECKOUT MODAL — STEP 2: PAYMENT → BACK TO STEP 1
// ============================================================

document.getElementById("step2-back").addEventListener("click", () => {
    goToStep(1);
});


// ============================================================
// CHECKOUT MODAL — STEP 2: PAYMENT → STEP 3
// ============================================================

document.getElementById("step2-next").addEventListener("click", () => {
    const selected = document.querySelector("input[name='payment']:checked");

    if (!selected) {
        showToast("⚠️ Please select a payment method.");
        return;
    }

    if (selected.value === "gcash" && !document.getElementById("gcash-ref").value.trim()) {
        showToast("⚠️ Please enter your GCash reference number.");
        return;
    }

    if (selected.value === "bank" && !document.getElementById("bank-ref").value.trim()) {
        showToast("⚠️ Please enter your bank reference number.");
        return;
    }

    buildOrderReview();
    goToStep(3);
});


// ============================================================
// CHECKOUT MODAL — STEP 3: REVIEW → BACK TO STEP 2
// ============================================================

document.getElementById("step3-back").addEventListener("click", () => {
    goToStep(2);
});


// ============================================================
// CHECKOUT MODAL — BUILD ORDER REVIEW CONTENT
// ============================================================

function buildOrderReview() {
    const fname    = document.getElementById("fname").value.trim();
    const lname    = document.getElementById("lname").value.trim();
    const phone    = document.getElementById("phone").value.trim();
    const street   = document.getElementById("street").value.trim();
    const city     = document.getElementById("city").value.trim();
    const province = document.getElementById("province").value.trim();
    const notes    = document.getElementById("notes").value.trim();

    const selectedPayment = document.querySelector("input[name='payment']:checked").value;
    const paymentLabels   = {
        gcash: "GCash",
        bank:  "Bank Transfer",
        cod:   "Cash on Delivery",
    };

    // Build address display
    let addressText = `${fname} ${lname} · ${phone}\n${street}, ${city}, ${province}`;
    if (notes) addressText += `\nNote: ${notes}`;
    document.getElementById("review-address").textContent = addressText;

    // Payment method label
    document.getElementById("review-payment").textContent = paymentLabels[selectedPayment];

    // Build items list
    const total = getCartTotal();
    const reviewItems = document.getElementById("review-items");
    reviewItems.innerHTML =
        cart.map(item => `
            <div class="summary-item">
                <span>${item.name} × ${item.qty}</span>
                <span>₱${(item.price * item.qty).toLocaleString()}</span>
            </div>
        `).join("") +
        `<div class="summary-total">
            <span>Total</span>
            <span>₱${total.toLocaleString()}</span>
        </div>`;
}


// ============================================================
// CHECKOUT MODAL — PLACE ORDER → THANK YOU SCREEN
// ============================================================

document.getElementById("place-order-btn").addEventListener("click", () => {
    // Generate order number
    const orderNumber = "BNB-" + Date.now().toString().slice(-6);

    // Update thank you screen
    document.getElementById("order-number-badge").textContent = "Order #" + orderNumber;
    document.getElementById("confirm-phone").textContent = document.getElementById("phone").value.trim();

    // Hide step indicators, update header
    checkoutSteps.style.display = "none";
    modalTitle.innerHTML = '<i class="fas fa-check-circle" style="color:var(--secondary-color);"></i> Order Confirmed!';

    // Show thank you panel
    goToStep("thanks");

    // Clear the cart
    cart = [];
    updateCartUI();
});


// ============================================================
// THANK YOU SCREEN — CLOSE BUTTON
// ============================================================

document.getElementById("close-thankyou-btn").addEventListener("click", () => {
    closeCheckout();
    // Reset step indicators for next time
    checkoutSteps.style.display = "flex";
});
