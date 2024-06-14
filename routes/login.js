const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.render('login');
  }
});

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !password) {
    errors.push({ msg: 'Tous les champs sont obligatoires' });
  }

  if (errors.length > 0) {
    res.render('login', { errors });
  } else {
    const user = await User.findOne({ email });
    if (!user) {
      errors.push({ msg: 'Cet utilisateur n\'existe pas' });
      res.render('login', { errors });
    } else if (!user.comparePassword(password)) {
      errors.push({ msg: 'Mot de passe incorrect' });
      res.render('login', { errors });
    } else {
      req.session.user = user;
      req.flash('success', 'Vous êtes maintenant connecté');
      res.redirect('/dashboard');
    }
  }
});

module.exports = router;