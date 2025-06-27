// Định nghĩa lớp CartItem
class CartItem {
  constructor(product) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.img = product.img;
    this.quantity = 1;
  }
}

// Biến toàn cục giỏ hàng
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Lưu giỏ hàng vào localStorage
const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Thêm sản phẩm vào giỏ
const addToCart = (productId) => {
  const product = window.allProducts.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(new CartItem(product));
  }

  saveCart();
  showNotification(`Đã thêm "${product.name}" vào giỏ hàng!`);
  updateCartBadge();
  renderCart();
};

// Xóa sản phẩm khỏi giỏ
const removeFromCart = (productId) => {
  const index = cart.findIndex(item => item.id === productId);
  if (index > -1) {
    const removedItem = cart[index];
    cart.splice(index, 1);
    saveCart();
    updateCartBadge();
    renderCart();
    showNotification(`Đã xóa "${removedItem.name}" khỏi giỏ hàng!`);
  }
};

// Cập nhật số lượng
const updateQuantity = (productId, change) => {
  const item = cart.find(item => item.id === productId);
  if (item) {
    const oldQuantity = item.quantity;
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      updateCartBadge();
      renderCart();
      if (change > 0) {
        showNotification(`Đã tăng số lượng "${item.name}"!`);
      } else {
        showNotification(`Đã giảm số lượng "${item.name}"!`);
      }
    }
  }
};

// Xóa toàn bộ giỏ
const clearCart = () => {
  if (cart.length === 0) {
    showNotification('Giỏ hàng đã trống!');
    return;
  }
  
  cart.length = 0;
  saveCart();
  updateCartBadge();
  renderCart();
  showNotification('Đã xóa tất cả sản phẩm khỏi giỏ hàng!');
};

// Hiển thị tổng tiền
const getTotalPrice = () => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Cập nhật huy hiệu giỏ hàng
const updateCartBadge = () => {
  cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const cartButton = document.querySelector('[data-modal-target="static-modal"]');
  const cartCount = document.querySelector('.cart-count');

  if (!cartButton) return;

  if (cartCount) {
    if (totalItems > 0) {
      cartCount.textContent = totalItems;
      cartCount.classList.remove('hidden');
    } else {
      cartCount.classList.add('hidden');
    }
  }
};

// Hiển thị thông báo
const showNotification = (message) => {
  const notification = document.createElement('div');
  notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
  notification.textContent = message;

  document.body.appendChild(notification);
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
};

// Render giao diện giỏ hàng
const renderCart = () => {
  cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartBody = document.getElementById("cartBody");
  const totalMoney = document.getElementById("totalMoney");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const checkoutBtn = document.getElementById("checkoutBtn");
  
  if (!cartBody) return;

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-8 text-gray-500">
          <i class="fas fa-shopping-cart text-4xl mb-4 block"></i>
          <p>Giỏ hàng trống</p>
          <p class="text-sm">Hãy thêm sản phẩm vào giỏ hàng</p>
        </td>
      </tr>
    `;
    if (totalMoney) {
      totalMoney.textContent = '$0.00';
    }
    if (clearCartBtn) {
      clearCartBtn.disabled = true;
      clearCartBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
    return;
  }

  let content = "";
  cart.forEach(item => {
    const total = item.price * item.quantity;
    content += `
      <tr class="hover:bg-gray-50 transition border-b">
        <td class="px-4 py-3">
          <img src="${item.img}" alt="${item.name}" class="h-16 w-16 object-contain rounded-md shadow-sm" />
        </td>
        <td class="px-4 py-3 font-semibold text-gray-800">${item.name}</td>
        <td class="px-4 py-3 text-gray-700">$${item.price}</td>
        <td class="px-4 py-3 text-center">
          <div class="flex items-center justify-center space-x-2">
            <button class="decrease-btn w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center font-bold text-lg transition-colors" data-id="${item.id}">-</button>
            <span class="w-8 text-center font-semibold">${item.quantity}</span>
            <button class="increase-btn w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center font-bold text-lg transition-colors" data-id="${item.id}">+</button>
          </div>
        </td>
        <td class="px-4 py-3 text-blue-600 font-semibold">$${total.toFixed(2)}</td>
        <td class="px-4 py-3">
          <button class="remove-btn text-red-600 hover:text-red-800 hover:underline font-medium transition-colors" data-id="${item.id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
  cartBody.innerHTML = content;

  // Gắn event listeners
  cartBody.querySelectorAll(".increase-btn").forEach(btn =>
    btn.addEventListener("click", () => updateQuantity(btn.dataset.id, 1))
  );
  cartBody.querySelectorAll(".decrease-btn").forEach(btn =>
    btn.addEventListener("click", () => updateQuantity(btn.dataset.id, -1))
  );
  cartBody.querySelectorAll(".remove-btn").forEach(btn =>
    btn.addEventListener("click", () => removeFromCart(btn.dataset.id))
  );

  if (totalMoney) {
    totalMoney.textContent = `$${getTotalPrice().toFixed(2)}`;
  }
  
  if (clearCartBtn) {
    clearCartBtn.disabled = false;
    clearCartBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }
  
  if (checkoutBtn) {
    checkoutBtn.disabled = false;
    checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }
};

// Xử lý thanh toán đơn giản
const processCheckout = () => {
  if (cart.length === 0) {
    showNotification('Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.');
    return;
  }
  cart.length = 0;
  saveCart();
  updateCartBadge();
  renderCart();
  showNotification('Thanh toán thành công! Cảm ơn bạn đã mua hàng.');
  document.getElementById('cart-modal').classList.add('hidden');
};

// Khởi tạo sau khi DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Event listener cho nút thêm vào giỏ
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-add-cart')) {
      const productId = e.target.getAttribute('data-id');
      addToCart(productId);
    }
  });

  // Event listener cho nút giỏ hàng
  const cartButton = document.querySelector('[data-modal-target="static-modal"]');
  if (cartButton) {
    cartButton.addEventListener('click', () => {
      renderCart();
      document.getElementById('cart-modal').classList.remove('hidden');
    });
  }

  // Event listener cho nút xóa tất cả
  const clearCartBtn = document.getElementById('clearCartBtn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }

  // Event listener cho nút thanh toán
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', processCheckout);
  }

  // Event listener để đóng modal khi click bên ngoài
  document.getElementById('cart-modal').addEventListener('click', (e) => {
    if (e.target.id === 'cart-modal') {
      e.target.classList.add('hidden');
    }
  });

  updateCartBadge();
});
