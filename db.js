import pg from 'pg';
import dotenv from 'dotenv';
import iconv from 'iconv-lite';

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'online_store_new',
  password:'qwerty',
  port: 5432,
  client_encoding: 'UTF8'
});

// Функция для исправления кодировки
export function fixEncoding(str) {
  if (!str) return str;
  return iconv.decode(Buffer.from(str, 'binary'), 'win1251') || str;
}

// Проверка подключения
try {
  await pool.query('SELECT NOW()');
  console.log('✅ PostgreSQL подключен');
} catch (err) {
  console.error('❌ Ошибка подключения к PostgreSQL:', err);
}

export const query = (text, params) => pool.query(text, params);
export const getClient = () => pool.connect();
export default pool;