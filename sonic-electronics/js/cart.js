/**
 * Sonic Electronics - Shopping Cart Script (Screen 4)
 */

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  setupCheckoutModal();

  window.addEventListener('sonic:cart-updated', () => {
    renderCart();
  });
});

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const summaryBox = document.getElementById('cart-summary-box');
  const emptyState = document.getElementById('cart-empty-state');
  const checkoutActionWrap = document.getElementById('checkout-action-wrap');

  if (!container) return;

  const cart = window.SonicState ? SonicState.getCart() : [];

  if (cart.length === 0) {
    if (container) container.innerHTML = '';
    if (summaryBox) summaryBox.style.display = 'none';
    if (checkoutActionWrap) checkoutActionWrap.style.display = 'none';
    if (emptyState) emptyState.style.display = 'flex';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (summaryBox) summaryBox.style.display = 'block';
  if (checkoutActionWrap) checkoutActionWrap.style.display = 'block';

  container.innerHTML = cart.map(item => {
    const product = window.SonicState ? SonicState.getProductById(item.productId) : null;
    if (!product) return '';

    const colorKey = item.selectedColor ? item.selectedColor.toLowerCase() : 'sand';
    const itemImg = product.images?.[colorKey] || product.image;
    const priceFormatted = window.SonicCommon ? SonicCommon.formatCurrency(product.price) : `₹${product.price.toFixed(2)}`;

    return `
      <div class="cart-item-card" data-product-id="${item.productId}" data-color="${item.selectedColor}">
        <div class="cart-item-thumb">
          <img src="${itemImg}" alt="${product.name}" />
        </div>
        <div class="cart-item-details">
          <span class="cart-item-subcat">${product.subCategory || 'SONIC AUDIO'}</span>
          <div class="cart-item-name-row">
            <h4 class="cart-item-name">${product.name}</h4>
            <span class="cart-item-price">${priceFormatted}</span>
          </div>
          <div class="cart-item-meta">
            <span style="color: var(--accent-star);">★</span>
            <span>${product.rating} (${product.reviewsCount} reviews)</span>
            <span style="color: var(--primary-green); font-weight: 600;">• In stock</span>
          </div>
          <div style="font-size: 11px; color: var(--secondary-text); margin-top: 2px;">
            Color: <strong>${item.selectedColor || 'Standard'}</strong>
          </div>
          <div class="cart-item-bottom-actions">
            <div class="cart-qty-pill">
              <button type="button" onclick="modifyQty('${item.productId}', ${item.quantity - 1}, '${item.selectedColor}')" aria-label="Decrease quantity">−</button>
              <span>${item.quantity}</span>
              <button type="button" onclick="modifyQty('${item.productId}', ${item.quantity + 1}, '${item.selectedColor}')" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="cart-remove-btn" onclick="removeItem('${item.productId}', '${item.selectedColor}')">
              Remove
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  renderOrderSummary();
}

function renderOrderSummary() {
  const subtotal = window.SonicState.calculateSubtotal();
  const shipping = window.SonicState.calculateShipping(subtotal);
  const tax = window.SonicState.calculateTax(subtotal);
  const total = window.SonicState.calculateTotal();
  const totalItems = window.SonicState.getCartCount();

  const subtotalLabel = document.getElementById('summary-subtotal-label');
  const subtotalVal = document.getElementById('summary-subtotal-val');
  const shippingVal = document.getElementById('summary-shipping-val');
  const taxVal = document.getElementById('summary-tax-val');
  const totalVal = document.getElementById('summary-total-val');

  if (subtotalLabel) subtotalLabel.textContent = `Subtotal (${totalItems} ${totalItems === 1 ? 'item' : 'items'})`;
  if (subtotalVal) subtotalVal.textContent = window.SonicCommon ? SonicCommon.formatCurrency(subtotal) : `₹${subtotal.toFixed(2)}`;
  
  if (shippingVal) {
    if (shipping === 0) {
      shippingVal.innerHTML = `<span class="free-shipping-tag">Free</span>`;
    } else {
      shippingVal.textContent = window.SonicCommon ? SonicCommon.formatCurrency(shipping) : `₹${shipping.toFixed(2)}`;
    }
  }

  if (taxVal) taxVal.textContent = window.SonicCommon ? SonicCommon.formatCurrency(tax) : `₹${tax.toFixed(2)}`;
  if (totalVal) totalVal.textContent = window.SonicCommon ? SonicCommon.formatCurrency(total) : `₹${total.toFixed(2)}`;
}

window.modifyQty = function(productId, newQty, color) {
  if (window.SonicState) {
    SonicState.updateQuantity(productId, newQty, color);
  }
};

window.removeItem = function(productId, color) {
  if (window.SonicState) {
    SonicState.removeFromCart(productId, color);
    if (window.SonicCommon) {
      SonicCommon.showToast('Item removed from cart', 'info');
    }
  }
};

function setupCheckoutModal() {
  const proceedBtn = document.getElementById('btn-proceed-checkout');
  const modal = document.getElementById('checkout-modal');
  const closeBtn = document.getElementById('checkout-modal-close');
  const checkoutForm = document.getElementById('demo-checkout-form');

  if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
      if (modal) modal.classList.add('open');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const customerName = document.getElementById('input-customer-name')?.value || 'Alex Morgan';
      const address = document.getElementById('input-address')?.value || '18 Spring St\nNew York, NY 10012';

      if (window.SonicState) {
        const order = SonicState.createDemoOrder({
          name: customerName,
          address: address
        });
        if (order) {
          window.location.href = 'order-confirmation.html';
        }
      }
    });
  }
}
