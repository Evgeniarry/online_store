import { query } from '../db.js';
import { faker } from '@faker-js/faker';

async function seedAnalytics() {
  // Генерация 1000 тестовых событий
  for (let i = 0; i < 1000; i++) {
    const daysAgo = faker.number.int({ min: 0, max: 30 });
    const hoursAgo = faker.number.int({ min: 0, max: 24 });
    
    await query(
      `INSERT INTO analytics_events 
       (event_type, session_id, client_id, data, created_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        'pageview',
        `session_${faker.string.uuid()}`,
        `client_${faker.string.uuid()}`,
        JSON.stringify({
          url: faker.helpers.arrayElement(['/', '/products', '/cart', '/checkout']),
          referrer: faker.internet.url()
        }),
        new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000)
      ]
    );
  }
  console.log('Тестовые данные аналитики добавлены');
}

seedAnalytics().catch(console.error);