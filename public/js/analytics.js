document.addEventListener('DOMContentLoaded', function() {
    // Отправка данных о просмотре страницы
    if (navigator.doNotTrack !== '1') {
      fetch('/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'pageview',
          url: window.location.pathname,
          referrer: document.referrer,
          screen: `${window.screen.width}x${window.screen.height}`
        }),
        keepalive: true
      });
    }
  
    // Отслеживание кликов по товарам
    document.querySelectorAll('[data-product]').forEach(item => {
      item.addEventListener('click', () => {
        fetch('/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'product_view',
            product_id: item.dataset.product
          }),
          keepalive: true
        });
      });
    });
  });