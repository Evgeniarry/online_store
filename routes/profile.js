import { Router } from 'express';
const router = Router();

router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/login'); // Исправлен путь на /auth/login
  }
  
  console.log('Authenticated user:', req.user); // Для отладки
  
  res.render('pages/profile', {
    title: 'Личный кабинет',
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      created_at: req.user.created_at
    }
  });
});

export default router;