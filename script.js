// Cart functionality
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartIcon = document.getElementById("cartIcon");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartFooter = document.getElementById("cartFooter");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.querySelector(".cart-count");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutPage = document.getElementById("checkoutPage");
const cancelCheckout = document.getElementById("cancelCheckout");
const backToHome = document.getElementById("backToHome");

// Open cart sidebar
cartIcon.addEventListener("click", () => {
  cartSidebar.classList.add("active");
  overlay.classList.add("active");
  renderCartItems();
});

// Close cart sidebar
closeCart.addEventListener("click", () => {
  cartSidebar.classList.remove("active");
  overlay.classList.remove("active");
});

overlay.addEventListener("click", () => {
  cartSidebar.classList.remove("active");
  overlay.classList.remove("active");
});

// Add to cart functionality
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    const name = e.target.dataset.name;
    const price = parseFloat(e.target.dataset.price);
    const image = e.target.dataset.image;

    // Check if item is already in cart
    const existingItem = cart.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id,
        name,
        price,
        image,
        quantity: 1,
      });
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update cart count
    updateCartCount();

    // Show notification
    showNotification(`${name} added to cart!`);

    // Only render cart items, do not open cart sidebar automatically
    renderCartItems();
  });
});

// Render cart items
function renderCartItems() {
  if (cart.length === 0) {
    cartItems.innerHTML = `
                    <div class="empty-cart-message" style="text-align: center; padding: 40px 0; color: var(--gray);">
                        <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 15px;"></i>
                        <h4>Your cart is empty</h4>
                        <p>Add some amazing travel packages to your cart</p>
                    </div>
                `;
    cartFooter.style.display = "none";
    return;
  }

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItemElement = document.createElement("div");
    cartItemElement.className = "cart-item";
    cartItemElement.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(
                          2
                        )}</div>
                        <div class="cart-item-actions">
                            <button class="quantity-btn minus" data-id="${
                              item.id
                            }">-</button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${
                              item.id
                            }">+</button>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;

    cartItems.appendChild(cartItemElement);
  });

  // Update total
  cartTotal.textContent = `$${total.toFixed(2)}`;
  cartFooter.style.display = "block";

  // Add event listeners to quantity buttons
  document.querySelectorAll(".quantity-btn.minus").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      updateQuantity(id, -1);
    });
  });

  document.querySelectorAll(".quantity-btn.plus").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      updateQuantity(id, 1);
    });
  });

  // Add event listeners to remove buttons
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      removeFromCart(id);
    });
  });
}

// Update item quantity
function updateQuantity(id, change) {
  const item = cart.find((item) => item.id === id);

  if (item) {
    item.quantity += change;

    if (item.quantity <= 0) {
      cart = cart.filter((item) => item.id !== id);
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update UI
    updateCartCount();
    renderCartItems();
  }
}

// Remove item from cart
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update UI
  updateCartCount();
  renderCartItems();

  // Show notification
  showNotification("Item removed from cart");
}

// Update cart count
function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = count;
}

// Show notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.backgroundColor = "var(--secondary)";
  notification.style.color = "white";
  notification.style.padding = "15px 25px";
  notification.style.borderRadius = "5px";
  notification.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
  notification.style.zIndex = "1000";
  notification.style.transform = "translateY(100px)";
  notification.style.opacity = "0";
  notification.style.transition = "all 0.3s";
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateY(0)";
    notification.style.opacity = "1";
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateY(100px)";
    notification.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Checkout functionality (popup modal)
checkoutBtn.addEventListener("click", () => {
  cartSidebar.classList.remove("active");
  overlay.classList.remove("active");
  checkoutPage.style.display = "flex";
  document.body.style.overflow = "hidden";
});
cancelCheckout.addEventListener("click", () => {
  checkoutPage.style.display = "none";
  document.body.style.overflow = "auto";
});
backToHome.addEventListener("click", (e) => {
  e.preventDefault();
  checkoutPage.style.display = "none";
  document.body.style.overflow = "auto";
  cart = [];
  localStorage.removeItem("cart");
  updateCartCount();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Payment method selection
document.querySelectorAll(".payment-method").forEach((method) => {
  method.addEventListener("click", () => {
    document.querySelectorAll(".payment-method").forEach((m) => {
      m.classList.remove("active");
    });
    method.classList.add("active");

    const methodType = method.dataset.method;
    document.getElementById("creditCardForm").style.display =
      methodType === "credit" ? "block" : "none";
    document.getElementById("paypalForm").style.display =
      methodType === "paypal" ? "block" : "none";
  });
});

// Checkout navigation
document.getElementById("nextToPayment").addEventListener("click", () => {
  document.getElementById("step1").classList.remove("active");
  document.getElementById("step1Content").style.display = "none";

  document.getElementById("step2").classList.add("active");
  document.getElementById("step2Content").style.display = "block";
});

document.getElementById("backToDetails").addEventListener("click", () => {
  document.getElementById("step2").classList.remove("active");
  document.getElementById("step2Content").style.display = "none";

  document.getElementById("step1").classList.add("active");
  document.getElementById("step1Content").style.display = "block";
});

document.getElementById("completeBooking").addEventListener("click", () => {
  document.getElementById("step2").classList.remove("active");
  document.getElementById("step2Content").style.display = "none";

  document.getElementById("step3").classList.add("active");
  document.getElementById("step3Content").style.display = "block";
});

// Package filtering
document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Add active class to clicked button
    button.classList.add("active");

    const filter = button.dataset.filter;
    // Only filter .package-card inside #destinations .packages-grid
    const packages = document.querySelectorAll(
      "#destinations .packages-grid .package-card"
    );

    packages.forEach((packageCard) => {
      if (filter === "all" || packageCard.dataset.category === filter) {
        packageCard.style.display = "block";
      } else {
        packageCard.style.display = "none";
      }
    });
  });
});

// Mobile menu
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navMenu = document.querySelector("nav ul");

mobileMenuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// Initialize cart count
updateCartCount();

// Form submission
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  showNotification("Message sent successfully!");
  document.getElementById("contactForm").reset();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });

      // Close mobile menu if open
      navMenu.classList.remove("active");
    }
  });
});
