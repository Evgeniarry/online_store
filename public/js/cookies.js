document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    
    // Проверяем, было ли уже принято согласие
    if (!localStorage.getItem('cookies-accepted')) {
      cookieBanner.style.display = 'block';
      
      // При клике на кнопку
      acceptBtn.addEventListener('click', function() {
        // Устанавливаем куки на 1 год
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        document.cookie = `cookies-accepted=true; expires=${date.toUTCString()}; path=/`;
        
        // Сохраняем в localStorage
        localStorage.setItem('cookies-accepted', 'true');
        
        // Скрываем баннер
        cookieBanner.style.display = 'none';
      });
    }
  });