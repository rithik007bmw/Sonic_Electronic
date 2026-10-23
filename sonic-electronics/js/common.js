/**
 * Sonic Electronics - Common Utilities & Shared UI Handlers
 */

// Format amount to Indian Rupee (₹129.00)
function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return `₹${num.toFixed(2)}`;
}

// Show a modern, elegant toast notification
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><path d="M20 6L9 17l-5-5"/></svg>`;
  } else if (type === 'heart') {
    iconSvg = `<svg viewBox="0 0 24 24" fill="#E24A4A" stroke="#E24A4A" width="18" height="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
  } else {
    iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  }

  toast.innerHTML = `
    <span class="toast-icon">${iconSvg}</span>
    <span class="toast-msg">${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  // Auto remove after 2.8s
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 2800);
}

// Global initialization on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (window.SonicState) {
    SonicState.syncCartBadges();
    SonicState.syncWishlistButtons();
  }

  // Handle wishlist button clicks across any page
  document.addEventListener('click', (e) => {
    const wishlistBtn = e.target.closest('[data-wishlist-id]');
    if (wishlistBtn) {
      e.preventDefault();
      e.stopPropagation();
      const productId = wishlistBtn.getAttribute('data-wishlist-id');
      if (window.SonicState && productId) {
        const isAdded = SonicState.toggleWishlist(productId);
        const product = SonicState.getProductById(productId);
        const name = product ? product.name : 'Product';
        if (isAdded) {
          showToast(`Added ${name} to Wishlist`, 'heart');
        } else {
          showToast(`Removed ${name} from Wishlist`, 'info');
        }
      }
    }
  });

  // Global search input handling (pressing enter)
  const searchInputs = document.querySelectorAll('.header-search-input, .search-field-input');
  searchInputs.forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = input.value.trim();
        window.location.href = `products.html?q=${encodeURIComponent(query)}`;
      }
    });
  });

  // Sync bottom nav active highlight
  highlightCurrentNav();
});

function highlightCurrentNav() {
  const path = window.location.pathname.toLowerCase();
  const navItems = document.querySelectorAll('.bottom-nav-item');
  if (!navItems.length) return;

  navItems.forEach(item => item.classList.remove('active'));

  if (path.includes('products.html') || path.includes('product-details.html')) {
    const exploreTab = document.querySelector('.bottom-nav-item[data-nav="explore"]');
    if (exploreTab) exploreTab.classList.add('active');
  } else if (path.includes('cart.html')) {
    const cartTab = document.querySelector('.bottom-nav-item[data-nav="cart"]');
    if (cartTab) cartTab.classList.add('active');
  } else if (path.includes('order-confirmation.html')) {
    // none or cart
  } else {
    // Default to Home
    const homeTab = document.querySelector('.bottom-nav-item[data-nav="home"]');
    if (homeTab) homeTab.classList.add('active');
  }
}

// Global export
if (typeof window !== 'undefined') {
  window.SonicCommon = {
    formatCurrency,
    showToast
  };
}
