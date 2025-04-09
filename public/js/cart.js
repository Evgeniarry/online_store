document.addEventListener('DOMContentLoaded', function() {
    // Элементы корзины
    const cartContainer = document.querySelector('.cart-items');
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    const removeBtns = document.querySelectorAll('.remove-btn');
    const checkoutBtn = document.querySelector('.checkout-btn');
  
    // Обработчики изменения количества
    if (cartContainer) {
      cartContainer.addEventListener('click', function(e) {
        const target = e.target;
        const item = target.closest('.cart-item');
        const id = item.dataset.id;
        const quantityElement = item.querySelector('.quantity');
        let quantity = parseInt(quantityElement.textContent);
  
        if (target.classList.contains('plus')) {
          quantity++;
          updateCartItem(id, quantity);
        } else if (target.classList.contains('minus') && quantity > 1) {
          quantity--;
          updateCartItem(id, quantity);
        } else if (target.classList.contains('remove-btn')) {
          removeCartItem(id);
        }
      });
    }
  
    // Оформление заказа
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function() {
        window.location.href = '/checkout';
      });
    }
  
    // Функции работы с корзиной
    function updateCartItem(id, quantity) {
      fetch('/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, quantity })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          location.reload();
        }
      });
    }
  
    function removeCartItem(id) {
      fetch('/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          location.reload();
        }
      });
    }

    // Добавление в корзину из каталога
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      const product = {
        id: this.dataset.id,
        name: this.dataset.name,
        price: this.dataset.price,
        image: this.dataset.image
      };
      
      fetch('/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      })
      .then(response => {
        if (!response.ok) throw new Error('Ошибка сети');
        return response.json();
      })
      .then(data => {
        if (data.success) {
          showNotification('Товар добавлен в корзину!');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showNotification('Ошибка при добавлении в корзину', 'error');
      });
    });
  });
  
  // Функция показа уведомлений
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  });