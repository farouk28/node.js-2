const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');

// Add a comparePassword function to the User model
User.prototype.comparePassword = function(password) {
  const saltBuffer = Buffer.from(this.salt, 'base64'); // Retrieve the salt buffer from the User document
  const hash = crypto.pbkdf2Sync(password, saltBuffer, 1000, 64, 'ha512').toString('hex');
  return hash === this.password;
};

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  const errors = [];

  if (!firstName ||!lastName ||!email ||!password ||!confirmPassword) {
    errors.push({ msg: 'Tous les champs sont obligatoires' });
  }

  if (password!== confirmPassword) {
    errors.push({ msg: 'Les mots de passe ne correspondent pas' });
  }

  if (errors.length > 0) {
    res.render('login', { errors });
  } else {
    const user = await User.findOne({ email });
    if (user) {
      errors.push({ msg: 'Cet utilisateur existe déjà' });
      res.render('login', { errors });
    } else {
      const salt = crypto.randomBytes(16).toString('hex'); // Generate a salt value
      const hashedPassword = await User.hashPassword(password, salt);
      const newUser = new User({ firstName, lastName, email, password: hashedPassword, salt });
      await newUser.save();
      req.flash('success', 'Vous êtes maintenant enregistré');
      res.redirect('/login');
    }
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('User not found.');
    err.status = 401;
    return next(err);
  }
  if (!(await user.comparePassword(password))) {
    const err = new Error('Wrong email or password.');
    err.status = 401;
    return next(err);
  }
  req.session.userId = user._id;
  res.redirect('/profile');
});

module.exports = router;