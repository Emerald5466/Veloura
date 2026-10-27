const products = [
  { id: 1, name: "The Everyday Tote", category: "Accessories", price: 18500, badge: "BESTSELLER", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80" },
  { id: 2, name: "Soft Neutral Set", category: "Fashion", price: 32000, badge: "NEW FIND", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80" },
  { id: 3, name: "Golden Hour Earrings", category: "Accessories", price: 9500, badge: "LITTLE LUXE", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80" },
  { id: 4, name: "Glow Essentials", category: "Beauty", price: 12500, badge: "SELF-CARE", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80" },
  { id: 5, name: "Classic Shoulder Bag", category: "Accessories", price: 24000, badge: "", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80" },
  { id: 6, name: "Weekend Style", category: "Fashion", price: 27500, badge: "JUST IN", image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=700&q=80" },
  { id: 7, name: "Pearl Detail Set", category: "Accessories", price: 11000, badge: "", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80" },
  { id: 8, name: "Cozy Living Edit", category: "Lifestyle", price: 16000, badge: "FEEL-GOOD FIND", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=80" }
];

const cart = [];
const wishlist = new Set();
let currentCategory = "All";
const money = amount => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function renderProducts() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(product =>
    (currentCategory === "All" || product.category === currentCategory) &&
    `${product.name} ${product.category}`.toLowerCase().includes(term)
  );
  grid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        <button class="wish-button ${wishlist.has(product.id) ? "selected" : ""}" data-wish="${product.id}" aria-label="Add ${product.name} to wishlist">${wishlist.has(product.id) ? "♥" : "♡"}</button>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <div class="product-bottom"><span class="product-price">${money(product.price)}</span><button class="add-button" data-add="${product.id}">ADD +</button></div>
      </div>
    </article>
  `).join("");
  emptyMessage.hidden = filtered.length !== 0;
}

function updateCounts() {
  document.getElementById("cartCount").textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("wishlistCount").textContent = wishlist.size;
}

function renderCart() {
  const items = document.getElementById("cartItems");
  if (!cart.length) {
    items.innerHTML = '<p class="empty-message">Your bag is waiting for something lovely. ♡</p>';
  } else {
    items.innerHTML = cart.map(item => `
      <div class="cart-row">
        <img src="${item.image}" alt="">
        <div><h3>${item.name}</h3><p>${money(item.price)} × ${item.quantity}</p></div>
        <button class="remove-button" data-remove="${item.id}">Remove</button>
      </div>
    `).join("");
  }
  document.getElementById("cartTotal").textContent = money(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  updateCounts();
}

function openDrawer(title = "Your bag") {
  document.getElementById("drawerTitle").textContent = title;
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("drawerBackdrop").classList.add("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "false");
}
function closeDrawer() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("drawerBackdrop").classList.remove("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "true");
}

document.querySelector(".main-nav").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  currentCategory = button.dataset.category;
  document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("active", link === button));
  renderProducts();
});
searchInput.addEventListener("input", renderProducts);

grid.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  const wishButton = event.target.closest("[data-wish]");
  if (addButton) {
    const product = products.find(item => item.id === Number(addButton.dataset.add));
    const existing = cart.find(item => item.id === product.id);
    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });
    renderCart();
    showToast(`${product.name} added to your bag`);
  }
  if (wishButton) {
    const id = Number(wishButton.dataset.wish);
    if (wishlist.has(id)) wishlist.delete(id); else wishlist.add(id);
    renderProducts();
    updateCounts();
    showToast(wishlist.has(id) ? "Added to your wishlist ♡" : "Removed from your wishlist");
  }
});

document.getElementById("cartToggle").addEventListener("click", () => { renderCart(); openDrawer("Your bag"); });
document.getElementById("wishlistToggle").addEventListener("click", () => {
  const saved = products.filter(product => wishlist.has(product.id));
  document.getElementById("drawerTitle").textContent = "Your wishlist";
  document.getElementById("cartItems").innerHTML = saved.length
    ? saved.map(product => `<div class="cart-row"><img src="${product.image}" alt=""><div><h3>${product.name}</h3><p>${money(product.price)}</p></div><button class="remove-button" data-wish-remove="${product.id}">Remove</button></div>`).join("")
    : '<p class="empty-message">Your wishlist is empty for now. ♡</p>';
  document.getElementById("cartTotal").textContent = "";
  document.getElementById("checkoutButton").hidden = true;
  openDrawer("Your wishlist");
});
document.getElementById("closeDrawer").addEventListener("click", closeDrawer);
document.getElementById("drawerBackdrop").addEventListener("click", closeDrawer);
document.getElementById("cartItems").addEventListener("click", event => {
  const remove = event.target.closest("[data-remove]");
  const wishRemove = event.target.closest("[data-wish-remove]");
  if (remove) {
    const index = cart.findIndex(item => item.id === Number(remove.dataset.remove));
    if (index !== -1) cart.splice(index, 1);
    renderCart();
  }
  if (wishRemove) {
    wishlist.delete(Number(wishRemove.dataset.wishRemove));
    updateCounts();
    document.getElementById("wishlistToggle").click();
    renderProducts();
  }
});
document.getElementById("cartToggle").addEventListener("click", () => {
  document.getElementById("checkoutButton").hidden = false;
});
document.getElementById("checkoutButton").addEventListener("click", () => showToast("Demo checkout only — no payment was taken."));
document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("newsletterMessage").textContent = "Thank you for your interest in Veloura! This is a demo form.";
  event.target.reset();
});
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
