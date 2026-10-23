/**
 * Sonic Electronics - Homepage Script (Screen 1)
 */

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedProducts();
  setupCategoryLinks();
  setupSearchInput();
});

function renderFeaturedProducts() {
  const container = document.getElementById('featured-products-grid');
  if (!container) return;

  const catalog = window.SONIC_PRODUCTS || [];
  // Screen 1 in Figma displays Sonic Air Pro & Sonic Flow as the featured items
  const featured = catalog.filter(p => p.featured || p.id === 'sonic-air-pro' || p.id === 'sonic-flow').slice(0, 2);

  container.innerHTML = featured.map(product => {
    const isSaved = window.SonicState ? SonicState.isWishlisted(product.id) : false;
    const priceFormatted = window.SonicCommon ? SonicCommon.formatCurrency(product.price) : `₹${product.price.toFixed(2)}`;
    
    return `
      <article class="product-card" data-product-id="${product.id}">
        <div class="card-image-box" onclick="navigateToProduct('${product.id}')">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
          <button 
            type="button" 
            class="card-wishlist-btn ${isSaved ? 'active' : ''}" 
            data-wishlist-id="${product.id}" 
            aria-label="Save ${product.name} to wishlist"
          >
            <span class="heart-icon">
              ${isSaved 
                ? '<svg viewBox="0 0 24 24" fill="#E24A4A" stroke="#E24A4A" width="18" height="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
                : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
              }
            </span>
          </button>
        </div>
        <div class="card-info" onclick="navigateToProduct('${product.id}')">
          <h3 class="card-title">${product.name}</h3>
          <div class="card-rating-row">
            <span class="star-icon">★</span>
            <span>${product.rating}</span>
            <span>(${product.reviewsCount})</span>
          </div>
          <div class="card-price-row">
            <span class="card-price">${priceFormatted}</span>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function navigateToProduct(productId) {
  if (window.SonicState) {
    SonicState.setSelectedProduct(productId);
  }
  window.location.href = `product-details.html?id=${productId}`;
}

function setupCategoryLinks() {
  const categoryCards = document.querySelectorAll('[data-category-target]');
  categoryCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = card.getAttribute('data-category-target');
      window.location.href = `products.html?category=${encodeURIComponent(cat)}`;
    });
  });
}

function setupSearchInput() {
  const searchInput = document.getElementById('home-search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchInput.value.trim();
        window.location.href = `products.html?q=${encodeURIComponent(query || 'Headphones')}`;
      }
    });
  }
}
