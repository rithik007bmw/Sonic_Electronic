/**
 * Sonic Electronics - Product Listing Script (Screen 2)
 */

let currentFilters = {
  wireless: true,
  anc: false,
  priceMax: 200,
  sortBy: 'recommended',
  category: 'Headphones',
  searchQuery: 'Headphones'
};

document.addEventListener('DOMContentLoaded', () => {
  initURLParams();
  setupFilterControls();
  setupSortControl();
  setupCompareListeners();
  renderProducts();
  renderCompareTray();
});

function initURLParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) {
    currentFilters.searchQuery = params.get('q');
  }
  if (params.get('category')) {
    currentFilters.category = params.get('category');
    currentFilters.searchQuery = params.get('category');
  }

  const searchInput = document.getElementById('listing-search-input');
  if (searchInput) {
    searchInput.value = currentFilters.searchQuery;
  }
}

function setupFilterControls() {
  // Wireless Chip Toggle
  const wirelessChip = document.getElementById('chip-wireless');
  if (wirelessChip) {
    wirelessChip.addEventListener('click', () => {
      currentFilters.wireless = !currentFilters.wireless;
      wirelessChip.classList.toggle('active', currentFilters.wireless);
      renderProducts();
    });
  }

  // ANC Chip Toggle
  const ancChip = document.getElementById('chip-anc');
  if (ancChip) {
    ancChip.addEventListener('click', () => {
      currentFilters.anc = !currentFilters.anc;
      ancChip.classList.toggle('active', currentFilters.anc);
      renderProducts();
    });
  }

  // Price Chip / Dropdown
  const priceChip = document.getElementById('chip-price');
  if (priceChip) {
    priceChip.addEventListener('click', () => {
      openFilterModal();
    });
  }

  // Filter Drawer / Modal Toggle
  const filtersBtn = document.getElementById('chip-filters');
  const modal = document.getElementById('filter-modal');
  const modalClose = document.getElementById('filter-modal-close');
  const applyBtn = document.getElementById('filter-apply-btn');
  const resetBtn = document.getElementById('filter-reset-btn');

  if (filtersBtn) filtersBtn.addEventListener('click', openFilterModal);
  if (modalClose) modalClose.addEventListener('click', closeFilterModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeFilterModal();
    });
  }

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const priceSlider = document.getElementById('filter-price-slider');
      if (priceSlider) currentFilters.priceMax = Number(priceSlider.value);
      closeFilterModal();
      renderProducts();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentFilters.wireless = false;
      currentFilters.anc = false;
      currentFilters.priceMax = 250;
      if (wirelessChip) wirelessChip.classList.remove('active');
      if (ancChip) ancChip.classList.remove('active');
      const priceSlider = document.getElementById('filter-price-slider');
      if (priceSlider) priceSlider.value = 250;
      closeFilterModal();
      renderProducts();
    });
  }
}

function openFilterModal() {
  const modal = document.getElementById('filter-modal');
  if (modal) modal.classList.add('open');
}

function closeFilterModal() {
  const modal = document.getElementById('filter-modal');
  if (modal) modal.classList.remove('open');
}

function setupSortControl() {
  const sortSelect = document.getElementById('listing-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentFilters.sortBy = e.target.value;
      renderProducts();
    });
  }
}

function renderProducts() {
  const grid = document.getElementById('listing-products-grid');
  const countEl = document.getElementById('products-count-label');
  if (!grid) return;

  const catalog = window.SONIC_PRODUCTS || [];
  
  // Filter products
  let filtered = catalog.filter(p => {
    // Search query check
    if (currentFilters.searchQuery && currentFilters.searchQuery.toLowerCase() !== 'all') {
      const q = currentFilters.searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchSub = p.subCategory.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchSub) return false;
    }

    // Wireless filter
    if (currentFilters.wireless && !p.isWireless) return false;

    // ANC filter
    if (currentFilters.anc && !p.ancSupported) return false;

    // Price filter
    if (p.price > currentFilters.priceMax) return false;

    return true;
  });

  // Sorting
  if (currentFilters.sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentFilters.sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentFilters.sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  // Update count label (showing 24 products or matching count)
  if (countEl) {
    const displayCount = (currentFilters.wireless && !currentFilters.anc && filtered.length >= 4) ? 24 : filtered.length;
    countEl.textContent = `${displayCount} products`;
  }

  const comparisonList = window.SonicState ? SonicState.getComparisonList() : [];

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 10px; color: var(--secondary-text);">
        <p style="font-size: 15px; font-weight: 600; color: var(--dark-text); margin-bottom: 6px;">No matching headphones found</p>
        <p style="font-size: 12px; margin-bottom: 14px;">Try loosening filters or adjusting your price limit.</p>
        <button type="button" class="btn-primary-action" style="max-width: 180px; margin: 0 auto; padding: 8px 16px; font-size: 12px;" onclick="resetAllFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(product => {
    const isSaved = window.SonicState ? SonicState.isWishlisted(product.id) : false;
    const isCompared = comparisonList.includes(product.id);
    const priceFormatted = window.SonicCommon ? SonicCommon.formatCurrency(product.price) : `₹${product.price.toFixed(2)}`;

    // Build feature lines matching Figma Screen 2
    let featureText = '';
    if (product.id === 'sonic-air-pro') {
      featureText = '40 h battery · Wireless<br>Adaptive ANC';
    } else if (product.id === 'sonic-studio') {
      featureText = '50 h battery · Wireless<br>Adaptive ANC';
    } else if (product.id === 'sonic-flow') {
      featureText = '35 h battery · Wireless<br>Hybrid ANC';
    } else if (product.id === 'sonic-lite') {
      featureText = '30 h battery · Wireless<br>Passive isolation';
    } else {
      featureText = `${product.battery} · ${product.anc}`;
    }

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
        <div class="card-info">
          <h3 class="card-title" onclick="navigateToProduct('${product.id}')">${product.name}</h3>
          <div class="card-rating-row" onclick="navigateToProduct('${product.id}')">
            <span class="star-icon">★</span>
            <span>${product.rating}</span>
            <span>(${product.reviewsCount})</span>
          </div>
          <div class="card-specs-text" onclick="navigateToProduct('${product.id}')">
            ${featureText}
          </div>
          <div class="card-price-row">
            <span class="card-price">${priceFormatted}</span>
            <label class="card-compare-label" onclick="event.stopPropagation()">
              <input 
                type="checkbox" 
                class="compare-checkbox" 
                data-compare-id="${product.id}"
                ${isCompared ? 'checked' : ''}
              />
              Compare
            </label>
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

window.resetAllFilters = function() {
  currentFilters.wireless = false;
  currentFilters.anc = false;
  currentFilters.priceMax = 250;
  const chipW = document.getElementById('chip-wireless');
  const chipA = document.getElementById('chip-anc');
  if (chipW) chipW.classList.remove('active');
  if (chipA) chipA.classList.remove('active');
  renderProducts();
};

function setupCompareListeners() {
  document.addEventListener('change', (e) => {
    if (e.target.matches('.compare-checkbox')) {
      const pid = e.target.getAttribute('data-compare-id');
      if (window.SonicState) {
        SonicState.toggleCompare(pid);
        renderCompareTray();
      }
    }
  });

  window.addEventListener('sonic:compare-updated', () => {
    renderCompareTray();
    // sync checkboxes
    const list = window.SonicState ? SonicState.getComparisonList() : [];
    document.querySelectorAll('.compare-checkbox').forEach(cb => {
      const pid = cb.getAttribute('data-compare-id');
      cb.checked = list.includes(pid);
    });
  });
}

function renderCompareTray() {
  let tray = document.getElementById('compare-tray');
  const list = window.SonicState ? SonicState.getComparisonList() : [];

  if (list.length === 0) {
    if (tray) tray.style.display = 'none';
    return;
  }

  if (!tray) {
    tray = document.createElement('div');
    tray.id = 'compare-tray';
    tray.className = 'compare-tray';
    document.body.appendChild(tray);
  }

  tray.style.display = 'flex';

  const itemsHtml = list.map(pid => {
    const prod = window.SonicState.getProductById(pid);
    if (!prod) return '';
    return `
      <div style="position: relative; display: inline-block;">
        <img src="${prod.image}" class="compare-mini-thumb" alt="${prod.name}" title="${prod.name}" />
        <button 
          type="button" 
          onclick="window.SonicState.removeCompare('${prod.id}')"
          style="position: absolute; -top: 4px; right: -4px; width: 14px; height: 14px; border-radius: 50%; background: #202020; color: #fff; border: none; font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center;"
        >×</button>
      </div>
    `;
  }).join('');

  tray.innerHTML = `
    <div class="compare-tray-items">
      <span style="font-size: 11.5px; font-weight: 600; color: var(--dark-text); margin-right: 4px;">Compare (${list.length}):</span>
      ${itemsHtml}
    </div>
    <button type="button" class="compare-btn-action" onclick="openComparisonModal()">
      Compare Now
    </button>
  `;
}

window.openComparisonModal = function() {
  const list = window.SonicState ? SonicState.getComparisonList() : [];
  if (list.length === 0) return;

  const prods = list.map(id => window.SonicState.getProductById(id)).filter(Boolean);

  let modal = document.getElementById('comparison-detail-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'comparison-detail-modal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="checkout-sheet" style="max-height: 90vh;">
      <div class="sheet-header">
        <h3>Product Comparison</h3>
        <button type="button" class="sheet-close-btn" onclick="document.getElementById('comparison-detail-modal').classList.remove('open')">×</button>
      </div>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;">
          <thead>
            <tr>
              <th style="padding: 8px; border-bottom: 1px solid var(--border-color); color: var(--secondary-text);">Feature</th>
              ${prods.map(p => `
                <th style="padding: 8px; border-bottom: 1px solid var(--border-color); text-align: center;">
                  <img src="${p.image}" style="width: 50px; height: 50px; object-fit: contain; background: var(--image-bg); border-radius: 8px; padding: 4px;" /><br>
                  <strong>${p.name}</strong><br>
                  <span style="color: var(--primary-green); font-weight: 700;">₹${p.price.toFixed(2)}</span>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid var(--border-light); font-weight: 600;">Rating</td>
              ${prods.map(p => `<td style="padding: 8px; border-bottom: 1px solid var(--border-light); text-align: center;">★ ${p.rating} (${p.reviewsCount})</td>`).join('')}
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid var(--border-light); font-weight: 600;">Battery</td>
              ${prods.map(p => `<td style="padding: 8px; border-bottom: 1px solid var(--border-light); text-align: center;">${p.battery}</td>`).join('')}
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid var(--border-light); font-weight: 600;">Noise Control</td>
              ${prods.map(p => `<td style="padding: 8px; border-bottom: 1px solid var(--border-light); text-align: center;">${p.anc}</td>`).join('')}
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid var(--border-light); font-weight: 600;">Connection</td>
              ${prods.map(p => `<td style="padding: 8px; border-bottom: 1px solid var(--border-light); text-align: center;">${p.connectivity}</td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>
      <button type="button" class="btn-primary-action" style="margin-top: 18px;" onclick="document.getElementById('comparison-detail-modal').classList.remove('open')">
        Close Comparison
      </button>
    </div>
  `;

  modal.classList.add('open');
};
