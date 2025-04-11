import { Router } from 'express';
import { query } from '../db.js';
import bcrypt from 'bcrypt';
import passport from 'passport';

const router = Router();

// Страница регистрации (ИСПРАВЛЕНО: добавил / перед auth)
router.get('/register', (req, res) => {
  res.render('pages/register', { error: null });
});

// Обработка регистрации (ИСПРАВЛЕНО: добавил / перед auth)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Проверка на пустые поля
    if (!username || !email || !password) {
      throw new Error('Все поля обязательны для заполнения');
    }
    
    const hash = await bcrypt.hash(password, 10);
    
    const { rows } = await query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hash]
    );
    
    // Автоматический вход после регистрации
    req.login(rows[0], err => {
      if (err) {
        console.error('Ошибка при автоматическом входе:', err);
        return res.redirect('/auth/login');
      }
      res.redirect('/profile');
    });
  } catch (err) {
    console.error('Ошибка регистрации:', err);
    res.status(400).render('pages/register', { 
      error: err.message,
      formData: req.body // Сохраняем введенные данные для повторного заполнения
    });
  }
});

// Страница входа (ИСПРАВЛЕНО: добавил /auth для единообразия)
router.get('/login', (req, res) => {
  res.render('pages/login', { 
    error: req.query.error,
    message: req.query.error ? 'Неверный логин или пароль' : null
  });
});

// Обработка входа
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login?error=1',
  failureFlash: false // Можно включить для flash-сообщений
}));

// Выход
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Ошибка при выходе:', err);
      return res.redirect('/profile');
    }
    res.redirect('/');
  });
});

export default router;