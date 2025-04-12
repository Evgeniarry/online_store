 document.addEventListener('DOMContentLoaded', function() {
  initializeCart();
  setupQuantityButtons();
  setupRemoveButtons();
  setupCheckoutButton();
  setupAddToCartButtons();
});

function initializeCart() {
  updateCartTotals();
}

function setupRemoveButtons() {
  const removeButtons = document.querySelectorAll('.remove-btn');
  
  removeButtons.forEach(btn => {
    btn.addEventListener('click', async function() {
      if (!confirm('Вы уверены, что хотите удалить товар из корзины?')) {
        return;
      }

      const itemElement = this.closest('.cart-item');
      if (!itemElement) {
        console.error('Не найден элемент товара');
        return;
      }

      const itemId = itemElement.dataset.id;
      console.log('Пытаемся удалить товар с ID:', itemId);

      try {
        const response = await fetch('/cart/remove', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: itemId })
        });

        const data = await response.json();
        console.log('Ответ сервера:', data);

        if (data.success) {
          // Удаляем элемент из DOM
          itemElement.remove();
          
          // Обновляем итоги
          updateCartTotals(data);
          
          // Показываем уведомление
          showNotification('Товар удалён из корзины');
          
          // Если корзина пуста, показываем сообщение
          if (data.cart.length === 0) {
            showEmptyCartMessage();
          }
        } else {
          showNotification(data.error || 'Ошибка удаления', 'error');
        }
      } catch (error) {
        console.error('Ошибка:', error);
        showNotification('Ошибка соединения', 'error');
      }
    });
  });
}

function setupQuantityButtons() {
  const buttons = document.querySelectorAll('.quantity-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', async function() {
      
      const itemElement = this.closest('.cart-item');
      if (!itemElement) {
        console.error('Не найден .cart-item');
        return;
      }

      const itemId = itemElement.dataset.id;
      const quantityElement = itemElement.querySelector('.quantity');
      
      if (!quantityElement) {
        console.error('Не найден элемент количества');
        return;
      }

      let quantity = parseInt(quantityElement.textContent);

      if (this.classList.contains('plus')) {
        quantity += 1;
      } else if (this.classList.contains('minus') && quantity > 1) {
        quantity -= 1;
      }

      // Временный мок для теста
      console.log('Пытаемся обновить количество:', quantity);
      try {
        console.log('Отправка запроса...');
        const response = await fetch('/cart/update', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: itemId, quantity })
        });

        console.log('Статус ответа:', response.status);
        const text = await response.text();
        console.log('Сырой ответ:', text);

        const data = JSON.parse(text);
        console.log('Разобранный ответ:', data);

        if (data.success) {
          quantityElement.textContent = quantity;
          updateCartTotals(data);
          showNotification('Количество обновлено');
        } else {
          console.error('Ошибка сервера:', data.error);
          showNotification(data.error || 'Ошибка обновления', 'error');
        }
      } catch (error) {
        console.error('Полная ошибка:', error);
        showNotification('Ошибка соединения', 'error');
      }
    });
  });
}

function updateCartTotals(data) {
  if (!data) return;
  
  // Обновляем общие суммы
  const totalItemsEl = document.querySelector('.total-items');
  const totalPriceEl = document.querySelector('.total-price');
  
  if (totalItemsEl) {
    totalItemsEl.textContent = data.totalItems || data.cart.reduce((sum, item) => sum + item.quantity, 0);
  }
  
  if (totalPriceEl) {
    const total = data.totalPrice || data.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceEl.textContent = total.toLocaleString('ru-RU') + ' ₽';
  }
  
  // Обновляем счетчик в шапке
  const cartCounter = document.querySelector('.cart-counter');
  if (cartCounter) {
    cartCounter.textContent = data.totalItems || data.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.classList.add('bounce');
    setTimeout(() => cartCounter.classList.remove('bounce'), 500);
  }
  
  // Обновляем суммы для каждого товара
  document.querySelectorAll('.cart-item').forEach(item => {
    const itemId = item.dataset.id;
    const product = data.cart.find(p => p.id === itemId);
    if (product) {
      const totalEl = item.querySelector('.item-total span');
      if (totalEl) {
        totalEl.textContent = (product.price * product.quantity).toLocaleString('ru-RU') + ' ₽';
      }
    }
  });
}

function showEmptyCartMessage() {
  const cartItems = document.querySelector('.cart-items');
  const cartSummary = document.querySelector('.cart-summary');
  
  if (cartItems) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <img src="/images/empty-cart.svg" alt="Корзина пуста">
        <h2>Корзина пуста</h2>
        <p>Добавьте товары из каталога</p>
        <a href="/catalog" class="btn">В каталог</a>
      </div>
    `;
  }
  
  if (cartSummary) {
    cartSummary.style.display = 'none';
  }
}

// Настройка кнопки оформления заказа
function setupCheckoutButton() {
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          window.location.href = this.href;
      });
  }
}

// Настройка кнопок добавления в корзину
function setupAddToCartButtons() {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', async function(e) {
          e.preventDefault();
          
          const product = {
              id: this.dataset.id,
              name: this.dataset.name,
              price: parseFloat(this.dataset.price),
              image: this.dataset.image || '/images/placeholder.jpg'
          };
          
          try {
              const response = await fetch('/cart/add', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(product)
              });
              
              const data = await response.json();
              
              if (data.success) {
                  showNotification('Товар добавлен в корзину!');
                  updateCartTotals(data.cart);
              } else {
                  showNotification(data.error || 'Ошибка добавления', 'error');
              }
          } catch (error) {
              console.error('Error:', error);
              showNotification('Ошибка соединения', 'error');
          }
      });
  });
}

// Показать уведомление
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
  }, 2700);
}

