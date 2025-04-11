// middleware/auth.js
export const isAuthenticated = (req, res, next) => {  // ← Обратите внимание на `export const`
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/auth/login');
  };

  export default isAuthenticated;