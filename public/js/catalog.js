document.addEventListener('DOMContentLoaded', function() {
    // Элементы управления
    const priceRange = document.getElementById('priceRange');
    const minPriceInput = document.getElementById('minPriceInput');
    const maxPriceInput = document.getElementById('maxPriceInput');
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    const sortSelect = document.getElementById('sortSelect');
    const searchInput = document.getElementById('searchInput');
    const productsGrid = document.querySelector('.products-grid');
  
    // Инициализация ценового диапазона
    if (priceRange && minPriceInput && maxPriceInput) {
      minPriceInput.value = priceRange.min;
      maxPriceInput.value = priceRange.value;
      
      priceRange.addEventListener('input', function() {
        maxPriceInput.value = this.value;
        applyFilters();
      });
      
      minPriceInput.addEventListener('input', applyFilters);
      maxPriceInput.addEventListener('input', applyFilters);
    }
  
    // Обработчики событий
    if (categoryCheckboxes) {
      categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
      });
    }
  
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);
    
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(applyFilters, 300);
      });
    }
  
    // Основная функция фильтрации
    function applyFilters() {
      if (!productsGrid) return;
      
      // Получаем параметры фильтрации
      const minPrice = minPriceInput ? parseInt(minPriceInput.value) || 0 : 0;
      const maxPrice = maxPriceInput ? parseInt(maxPriceInput.value) || 100000 : 100000;
      const selectedCategories = getSelectedCategories();
      const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
      const sortType = sortSelect ? sortSelect.value : 'default';
      
      // Фильтрация товаров
      const productCards = Array.from(productsGrid.querySelectorAll('.product-card'));
      let visibleCards = [];
      
      productCards.forEach(card => {
        const price = parseInt(card.dataset.price) || 0;
        const category = card.dataset.category || '';
        const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
        
        // Проверяем соответствие фильтрам
        const priceMatch = price >= minPrice && price <= maxPrice;
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(category);
        const searchMatch = title.includes(searchTerm);
        
        if (priceMatch && categoryMatch && searchMatch) {
          card.style.display = 'block';
          visibleCards.push(card);
        } else {
          card.style.display = 'none';
        }
      });
      
      // Сортировка
      if (sortType !== 'default') {
        visibleCards.sort((a, b) => {
          const priceA = parseInt(a.dataset.price) || 0;
          const priceB = parseInt(b.dataset.price) || 0;
          const nameA = a.querySelector('.product-title')?.textContent.toLowerCase() || '';
          const nameB = b.querySelector('.product-title')?.textContent.toLowerCase() || '';
          
          switch(sortType) {
            case 'price_asc': return priceA - priceB;
            case 'price_desc': return priceB - priceA;
            case 'name_asc': return nameA.localeCompare(nameB);
            case 'name_desc': return nameB.localeCompare(nameA);
            default: return 0;
          }
        });
        
        // Переставляем карточки в DOM
        productsGrid.innerHTML = '';
        visibleCards.forEach(card => productsGrid.appendChild(card));
      }
      
      // Показываем сообщение, если нет товаров
      showNoProductsMessage(visibleCards.length);
    }
  
    // Получаем выбранные категории
    function getSelectedCategories() {
      return Array.from(categoryCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    }
  
    // Показываем сообщение "Нет товаров"
    function showNoProductsMessage(visibleCount) {
      let noProductsMsg = productsGrid.querySelector('.no-products');
      
      if (visibleCount === 0 && !noProductsMsg) {
        noProductsMsg = document.createElement('div');
        noProductsMsg.className = 'no-products';
        noProductsMsg.innerHTML = '<p>Товары не найдены. Попробуйте изменить параметры фильтрации.</p>';
        productsGrid.appendChild(noProductsMsg);
      } else if (visibleCount > 0 && noProductsMsg) {
        noProductsMsg.remove();
      }
    }
  
    // Инициализация при загрузке
    applyFilters();
  });