const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect('mongodb://localhost/students', { useNewUrlParser: true, useUnifiedTopology: true });

// Set Pug as the template engine
app.set('view engine', 'pug');

// Set the views directory
app.set('views', './views');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(flash());

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/login', require('./routes/login'));
app.use('/dashboard', require('./routes/dashboard'));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});