/**
 * Sonic Electronics - Product Details Script (Screen 3)
 */

let currentProduct = null;
let selectedColor = null;
let currentQuantity = 1;

document.addEventListener('DOMContentLoaded', () => {
  loadProductDetails();
  setupQuantityControls();
  setupCartActions();
});

function loadProductDetails() {
  const productId = window.SonicState ? SonicState.getSelectedProduct() : 'sonic-air-pro';
  currentProduct = window.SonicState ? SonicState.getProductById(productId) : null;

  if (!currentProduct) {
    // Fallback to first product
    currentProduct = (window.SONIC_PRODUCTS && window.SONIC_PRODUCTS[0]) || null;
  }

  if (!currentProduct) return;

  selectedColor = currentProduct.defaultColor || (currentProduct.colors?.[0]?.name) || 'Sand';

  // Render Page Content
  renderHeroGallery();
  renderProductMeta();
  renderColorSwatches();
  renderFeaturePills();
  renderDescription();
  updateWishlistState();
}

function renderHeroGallery() {
  const heroImg = document.getElementById('details-hero-img');
  const bestsellerBadge = document.getElementById('bestseller-badge');
  const heroWishlistBtn = document.getElementById('hero-wishlist-btn');

  if (heroImg) {
    const colorKey = selectedColor.toLowerCase();
    const imgSrc = currentProduct.images?.[colorKey] || currentProduct.image;
    heroImg.src = imgSrc;
    heroImg.alt = `${currentProduct.name} in ${selectedColor}`;
  }

  if (bestsellerBadge) {
    bestsellerBadge.style.display = currentProduct.bestseller ? 'inline-block' : 'none';
  }

  if (heroWishlistBtn) {
    heroWishlistBtn.setAttribute('data-wishlist-id', currentProduct.id);
  }
}

function renderProductMeta() {
  const subCatEl = document.getElementById('details-sub-cat');
  const nameEl = document.getElementById('details-name');
  const priceEl = document.getElementById('details-price');
  const ratingEl = document.getElementById('details-rating');
  const reviewsCountEl = document.getElementById('details-reviews-count');
  const stockEl = document.getElementById('details-stock');

  if (subCatEl) subCatEl.textContent = currentProduct.subCategory || 'SONIC · WIRELESS OVER-EAR';
  if (nameEl) nameEl.textContent = currentProduct.name;
  if (priceEl) priceEl.textContent = window.SonicCommon ? SonicCommon.formatCurrency(currentProduct.price) : `₹${currentProduct.price.toFixed(2)}`;
  if (ratingEl) ratingEl.textContent = currentProduct.rating;
  if (reviewsCountEl) reviewsCountEl.textContent = `${currentProduct.reviewsCount} reviews`;
  if (stockEl) stockEl.textContent = currentProduct.inStock ? 'In stock' : 'Out of stock';
}

function renderColorSwatches() {
  const group = document.getElementById('color-swatches-group');
  const label = document.getElementById('selected-color-label');

  if (label) {
    label.textContent = `Color: ${selectedColor}`;
  }

  if (!group || !currentProduct.colors) return;

  group.innerHTML = currentProduct.colors.map(c => {
    const isActive = c.name.toLowerCase() === selectedColor.toLowerCase();
    return `
      <button 
        type="button" 
        class="color-swatch-btn ${isActive ? 'active' : ''}" 
        style="background-color: ${c.hex};" 
        title="${c.name}"
        onclick="switchColor('${c.name}')"
        aria-label="Select color ${c.name}"
      ></button>
    `;
  }).join('');
}

window.switchColor = function(colorName) {
  selectedColor = colorName;
  const label = document.getElementById('selected-color-label');
  if (label) label.textContent = `Color: ${selectedColor}`;

  const group = document.getElementById('color-swatches-group');
  if (group && currentProduct.colors) {
    group.querySelectorAll('.color-swatch-btn').forEach((btn, idx) => {
      const c = currentProduct.colors[idx];
      btn.classList.toggle('active', c && c.name.toLowerCase() === colorName.toLowerCase());
    });
  }

  // Update Hero Image
  const heroImg = document.getElementById('details-hero-img');
  if (heroImg && currentProduct.images) {
    const key = colorName.toLowerCase();
    const newSrc = currentProduct.images[key] || currentProduct.image;
    heroImg.style.opacity = '0.5';
    setTimeout(() => {
      heroImg.src = newSrc;
      heroImg.style.opacity = '1';
    }, 120);
  }
};

function renderFeaturePills() {
  const container = document.getElementById('features-pills-row');
  if (!container || !currentProduct.specs) return;

  // Icons for specs
  const getIconSvg = (iconType) => {
    switch (iconType) {
      case 'battery':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><rect x="1" y="6" width="18" height="12" rx="3"/><line x1="23" y1="11" x2="23" y2="13"/><line x1="6" y1="10" x2="6" y2="14"/><line x1="10" y1="10" x2="10" y2="14"/></svg>`;
      case 'anc':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M2 10v4M6 6v12M10 3v18M14 6v12M18 10v4M22 12v0"/></svg>`;
      case 'bluetooth':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/></svg>`;
      default:
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="9"/></svg>`;
    }
  };

  container.innerHTML = currentProduct.specs.map(spec => `
    <div class="feature-pill-card">
      <div class="feature-pill-icon">${getIconSvg(spec.icon)}</div>
      <div class="feature-pill-title">${spec.title}</div>
      <div class="feature-pill-sub">${spec.subtitle}</div>
    </div>
  `).join('');
}

function renderDescription() {
  const taglineEl = document.getElementById('details-tagline');
  const descEl = document.getElementById('details-desc');

  if (taglineEl) taglineEl.textContent = currentProduct.tagline || 'Your world, on quiet.';
  if (descEl) descEl.textContent = currentProduct.description;
}

function setupQuantityControls() {
  const minusBtn = document.getElementById('qty-minus-btn');
  const plusBtn = document.getElementById('qty-plus-btn');
  const qtyDisplay = document.getElementById('qty-val');

  if (minusBtn && plusBtn && qtyDisplay) {
    minusBtn.addEventListener('click', () => {
      if (currentQuantity > 1) {
        currentQuantity--;
        qtyDisplay.textContent = currentQuantity;
      }
    });

    plusBtn.addEventListener('click', () => {
      if (currentQuantity < 10) {
        currentQuantity++;
        qtyDisplay.textContent = currentQuantity;
      }
    });
  }
}

function setupCartActions() {
  const addCartBtn = document.getElementById('btn-add-to-cart');
  const buyNowBtn = document.getElementById('btn-buy-now');

  if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
      if (!currentProduct) return;
      if (window.SonicState) {
        SonicState.addToCart(currentProduct.id, currentQuantity, selectedColor);
        if (window.SonicCommon) {
          SonicCommon.showToast(`Added ${currentProduct.name} (${selectedColor}) to Cart!`, 'success');
        }
      }
    });
  }

  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      if (!currentProduct) return;
      if (window.SonicState) {
        SonicState.addToCart(currentProduct.id, currentQuantity, selectedColor);
      }
      window.location.href = 'cart.html';
    });
  }
}

function updateWishlistState() {
  if (window.SonicState) {
    SonicState.syncWishlistButtons();
  }
}

// Back button handler
window.handleDetailBack = function() {
  if (document.referrer && document.referrer.includes(window.location.host)) {
    window.history.back();
  } else {
    window.location.href = 'products.html';
  }
};
