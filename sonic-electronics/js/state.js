/**
 * Sonic Electronics - State Management
 * Persistent state via localStorage for Cart, Wishlist, Selected Product, and Last Order
 */

const STORAGE_KEYS = {
  CART: 'sonic_cart',
  WISHLIST: 'sonic_wishlist',
  SELECTED_PRODUCT: 'sonic_selected_product',
  LAST_ORDER: 'sonic_last_order',
  COMPARISON: 'sonic_compare'
};

const TAX_RATE = 0.08; // 8%
const FREE_SHIPPING_THRESHOLD = 99.00;
const STANDARD_SHIPPING_FEE = 15.00;

// Helper: safe JSON parse
function safeParse(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) ?? fallback;
  } catch (e) {
    console.warn(`Error reading localStorage key "${key}":`, e);
    return fallback;
  }
}

// Helper: safe JSON save
function safeSave(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn(`Error writing to localStorage key "${key}":`, e);
    return false;
  }
}

// Seed initial demo cart if not initialized yet to match Figma reference mockup (2 items, ₹153.00)
function initializeDefaultState() {
  if (localStorage.getItem(STORAGE_KEYS.CART) === null) {
    const defaultCart = [
      { productId: 'sonic-air-pro', quantity: 1, selectedColor: 'Sand' },
      { productId: 'sonic-travel-case', quantity: 1, selectedColor: 'Charcoal' }
    ];
    safeSave(STORAGE_KEYS.CART, defaultCart);
  }

  if (localStorage.getItem(STORAGE_KEYS.WISHLIST) === null) {
    // Default wishlist can have sonic-air-pro or empty
    safeSave(STORAGE_KEYS.WISHLIST, ['sonic-air-pro']);
  }
}

// ----------------------------------------------------
// Product Lookups
// ----------------------------------------------------
function getProductById(productId) {
  const catalog = window.SONIC_PRODUCTS || [];
  return catalog.find(p => p.id === productId) || null;
}

function setSelectedProduct(productId) {
  safeSave(STORAGE_KEYS.SELECTED_PRODUCT, productId);
}

function getSelectedProduct() {
  // Check URL param first
  if (typeof window !== 'undefined' && window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    if (idParam && getProductById(idParam)) {
      setSelectedProduct(idParam);
      return idParam;
    }
  }
  const saved = safeParse(STORAGE_KEYS.SELECTED_PRODUCT, 'sonic-air-pro');
  return getProductById(saved) ? saved : 'sonic-air-pro';
}

// ----------------------------------------------------
// Cart Management
// ----------------------------------------------------
function getCart() {
  return safeParse(STORAGE_KEYS.CART, []);
}

function addToCart(productId, quantity = 1, selectedColor = null) {
  const product = getProductById(productId);
  if (!product) return false;

  const color = selectedColor || product.defaultColor || 'Standard';
  const cart = getCart();

  const existingIndex = cart.findIndex(
    item => item.productId === productId && item.selectedColor === color
  );

  const cleanQty = Math.max(1, parseInt(quantity, 10) || 1);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += cleanQty;
  } else {
    cart.push({
      productId,
      quantity: cleanQty,
      selectedColor: color
    });
  }

  safeSave(STORAGE_KEYS.CART, cart);
  syncCartBadges();
  window.dispatchEvent(new CustomEvent('sonic:cart-updated', { detail: { cart } }));
  return true;
}

function updateQuantity(productId, quantity, selectedColor) {
  const cart = getCart();
  const index = cart.findIndex(
    item => item.productId === productId && (selectedColor ? item.selectedColor === selectedColor : true)
  );

  if (index === -1) return false;

  const newQty = parseInt(quantity, 10);
  if (newQty <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity = newQty;
  }

  safeSave(STORAGE_KEYS.CART, cart);
  syncCartBadges();
  window.dispatchEvent(new CustomEvent('sonic:cart-updated', { detail: { cart } }));
  return true;
}

function removeFromCart(productId, selectedColor) {
  let cart = getCart();
  cart = cart.filter(
    item => !(item.productId === productId && (selectedColor ? item.selectedColor === selectedColor : true))
  );

  safeSave(STORAGE_KEYS.CART, cart);
  syncCartBadges();
  window.dispatchEvent(new CustomEvent('sonic:cart-updated', { detail: { cart } }));
  return true;
}

function clearCart() {
  safeSave(STORAGE_KEYS.CART, []);
  syncCartBadges();
  window.dispatchEvent(new CustomEvent('sonic:cart-updated', { detail: { cart: [] } }));
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.quantity || 0), 0);
}

function calculateSubtotal() {
  const cart = getCart();
  let subtotal = 0;
  for (const item of cart) {
    const product = getProductById(item.productId);
    if (product) {
      subtotal += product.price * (item.quantity || 1);
    }
  }
  return Math.round(subtotal * 100) / 100;
}

function calculateShipping(subtotal) {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

function calculateTax(subtotal) {
  return Math.round(subtotal * TAX_RATE * 100) / 100;
}

function calculateTotal() {
  const subtotal = calculateSubtotal();
  if (subtotal <= 0) return 0;
  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);
  return Math.round((subtotal + shipping + tax) * 100) / 100;
}

function syncCartBadges() {
  const count = getCartCount();
  const badges = document.querySelectorAll('.cart-badge, [data-cart-badge]');
  badges.forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ----------------------------------------------------
// Wishlist Management
// ----------------------------------------------------
function getWishlist() {
  return safeParse(STORAGE_KEYS.WISHLIST, []);
}

function isWishlisted(productId) {
  const list = getWishlist();
  return list.includes(productId);
}

function toggleWishlist(productId) {
  let list = getWishlist();
  const index = list.indexOf(productId);
  let added = false;

  if (index > -1) {
    list.splice(index, 1);
    added = false;
  } else {
    list.push(productId);
    added = true;
  }

  safeSave(STORAGE_KEYS.WISHLIST, list);
  syncWishlistButtons();
  window.dispatchEvent(new CustomEvent('sonic:wishlist-updated', { detail: { wishlist: list, productId, added } }));
  return added;
}

function syncWishlistButtons() {
  const wishlist = getWishlist();
  const buttons = document.querySelectorAll('[data-wishlist-id]');
  buttons.forEach(btn => {
    const pid = btn.getAttribute('data-wishlist-id');
    const active = wishlist.includes(pid);
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    const heartIcon = btn.querySelector('.heart-icon');
    if (heartIcon) {
      if (active) {
        heartIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="#E24A4A" stroke="#E24A4A" width="20" height="20"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
      } else {
        heartIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
      }
    }
  });
}

// ----------------------------------------------------
// Comparison Management
// ----------------------------------------------------
function getComparisonList() {
  return safeParse(STORAGE_KEYS.COMPARISON, []);
}

function toggleCompare(productId) {
  let list = getComparisonList();
  const idx = list.indexOf(productId);
  if (idx > -1) {
    list.splice(idx, 1);
  } else {
    if (list.length >= 3) {
      list.shift(); // keep max 3
    }
    list.push(productId);
  }
  safeSave(STORAGE_KEYS.COMPARISON, list);
  window.dispatchEvent(new CustomEvent('sonic:compare-updated', { detail: { list } }));
  return list;
}

function removeCompare(productId) {
  let list = getComparisonList();
  list = list.filter(id => id !== productId);
  safeSave(STORAGE_KEYS.COMPARISON, list);
  window.dispatchEvent(new CustomEvent('sonic:compare-updated', { detail: { list } }));
  return list;
}

// ----------------------------------------------------
// Order Management
// ----------------------------------------------------
function createDemoOrder(customerDetails = {}) {
  const cart = getCart();
  if (cart.length === 0) return null;

  const subtotal = calculateSubtotal();
  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);
  const total = calculateTotal();

  const purchasedProducts = cart.map(item => {
    const prod = getProductById(item.productId);
    return {
      productId: item.productId,
      name: prod ? prod.name : item.productId,
      price: prod ? prod.price : 0,
      image: prod ? (prod.images?.[item.selectedColor?.toLowerCase()] || prod.image) : '',
      selectedColor: item.selectedColor,
      quantity: item.quantity,
      lineTotal: Math.round(((prod ? prod.price : 0) * item.quantity) * 100) / 100
    };
  });

  // Calculate dynamic demo arrival date (e.g. 3-5 days ahead)
  const now = new Date();
  const arr1 = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const arr2 = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const arrivalString = `${months[arr1.getMonth()]} ${arr1.getDate()}–${arr2.getDate()}`;

  const orderId = '#CT' + Math.floor(10000 + Math.random() * 90000);

  const order = {
    orderId: orderId,
    date: new Date().toISOString(),
    customerName: customerDetails.name || 'Alex Morgan',
    address: customerDetails.address || '18 Spring St\nNew York, NY 10012',
    deliveryWindow: arrivalString,
    items: purchasedProducts,
    totalItems: getCartCount(),
    subtotal: subtotal,
    shippingFee: shipping,
    tax: tax,
    total: total,
    paymentStatus: 'Paid · Visa ending in 4242',
    status: 'Demo payment confirmed'
  };

  safeSave(STORAGE_KEYS.LAST_ORDER, order);
  clearCart(); // clear cart only after successful order creation
  return order;
}

function getLastOrder() {
  let order = safeParse(STORAGE_KEYS.LAST_ORDER, null);
  // If no previous order exists yet, provide demo order matching Figma reference Screen 5
  if (!order) {
    order = {
      orderId: '#CT10482',
      date: new Date().toISOString(),
      customerName: 'Alex Morgan',
      address: '18 Spring St\nNew York, NY 10012',
      deliveryWindow: 'Oct 20–22',
      items: [
        {
          productId: 'sonic-air-pro',
          name: 'Sonic Air Pro',
          price: 129.00,
          image: 'assets/images/sonic-air-pro-sand.jpg',
          selectedColor: 'Sand',
          quantity: 1,
          lineTotal: 129.00
        },
        {
          productId: 'sonic-travel-case',
          name: 'Sonic Travel Case',
          price: 24.00,
          image: 'assets/images/sonic-travel-case.jpg',
          selectedColor: 'Charcoal',
          quantity: 1,
          lineTotal: 24.00
        }
      ],
      totalItems: 2,
      subtotal: 153.00,
      shippingFee: 0,
      tax: 12.24,
      total: 165.24,
      paymentStatus: 'Paid · Visa ending in 4242',
      status: 'Demo payment confirmed'
    };
    safeSave(STORAGE_KEYS.LAST_ORDER, order);
  }
  return order;
}

// Initialize seed data on load
initializeDefaultState();

// Global export
if (typeof window !== 'undefined') {
  window.SonicState = {
    getProductById,
    setSelectedProduct,
    getSelectedProduct,
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    calculateSubtotal,
    calculateShipping,
    calculateTax,
    calculateTotal,
    syncCartBadges,
    getWishlist,
    isWishlisted,
    toggleWishlist,
    syncWishlistButtons,
    getComparisonList,
    toggleCompare,
    removeCompare,
    createDemoOrder,
    getLastOrder
  };
}
