const express = require('express');
const router = express.Router();

router.get('/dashboard', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    res.render('dashboard', { user: req.session.user });
  }
});

module.exports = router;