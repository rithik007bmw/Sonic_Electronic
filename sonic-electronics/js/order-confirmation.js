/**
 * Sonic Electronics - Order Confirmation Script (Screen 5)
 */

document.addEventListener('DOMContentLoaded', () => {
  renderOrderConfirmation();
});

function renderOrderConfirmation() {
  const order = window.SonicState ? SonicState.getLastOrder() : null;

  const customerGreeting = document.getElementById('confirm-greeting');
  const deliveryWindow = document.getElementById('confirm-delivery-window');
  const customerAddress = document.getElementById('confirm-address');
  const orderId = document.getElementById('confirm-order-id');
  const itemsContainer = document.getElementById('confirm-items-list');

  const subtotalVal = document.getElementById('confirm-subtotal');
  const shippingVal = document.getElementById('confirm-shipping');
  const taxVal = document.getElementById('confirm-tax');
  const totalVal = document.getElementById('confirm-total');
  const paymentBadge = document.getElementById('confirm-payment-badge');

  if (!order) {
    if (customerGreeting) customerGreeting.textContent = "You're all set!";
    return;
  }

  // Greeting
  const firstName = (order.customerName || 'Alex').split(' ')[0];
  if (customerGreeting) {
    customerGreeting.textContent = `You're all set, ${firstName}!`;
  }

  // Delivery Card
  if (deliveryWindow) {
    deliveryWindow.textContent = `Arrives ${order.deliveryWindow || 'Oct 20–22'}`;
  }
  if (customerAddress) {
    const formattedAddress = `${order.customerName}\n${order.address || '18 Spring St\nNew York, NY 10012'}`;
    customerAddress.textContent = formattedAddress;
  }

  // Order ID
  if (orderId) {
    orderId.textContent = order.orderId || '#CT10482';
  }

  // Items List
  if (itemsContainer && order.items) {
    itemsContainer.innerHTML = order.items.map(item => {
      const priceFormatted = window.SonicCommon ? SonicCommon.formatCurrency(item.price) : `₹${item.price.toFixed(2)}`;
      const colorText = item.selectedColor ? ` · ${item.selectedColor}` : '';

      return `
        <div class="confirm-item-row">
          <div class="confirm-item-left">
            <img src="${item.image || 'assets/images/sonic-air-pro.jpg'}" alt="${item.name}" class="confirm-item-thumb" />
            <div class="confirm-item-meta">
              <span class="confirm-item-title">${item.name}</span>
              <span class="confirm-item-sub">${item.selectedColor ? item.selectedColor + ' · ' : ''}Qty ${item.quantity}</span>
            </div>
          </div>
          <span class="confirm-item-price">${priceFormatted}</span>
        </div>
      `;
    }).join('');
  }

  // Summary Totals
  if (subtotalVal) {
    subtotalVal.textContent = window.SonicCommon ? SonicCommon.formatCurrency(order.subtotal) : `₹${order.subtotal.toFixed(2)}`;
  }

  if (shippingVal) {
    if (order.shippingFee === 0) {
      shippingVal.innerHTML = `<span class="free-shipping-tag">Free</span>`;
    } else {
      shippingVal.textContent = window.SonicCommon ? SonicCommon.formatCurrency(order.shippingFee) : `₹${order.shippingFee.toFixed(2)}`;
    }
  }

  if (taxVal) {
    taxVal.textContent = window.SonicCommon ? SonicCommon.formatCurrency(order.tax) : `₹${order.tax.toFixed(2)}`;
  }

  if (totalVal) {
    totalVal.textContent = window.SonicCommon ? SonicCommon.formatCurrency(order.total) : `₹${order.total.toFixed(2)}`;
  }

  if (paymentBadge && order.paymentStatus) {
    paymentBadge.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${order.paymentStatus}</span>
    `;
  }
}
