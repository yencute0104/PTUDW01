const express = require('express');
const router = express.Router();

const passport = require('../passport');
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', userController.index);

router.get('/login', function(req, res, next){
  res.render('users/login');
})

router.post('/login',  passport.authenticate('local', { successRedirect: '/',
failureRedirect: '/login?error-wrong',
failureFlash: false}))

router.get('/register', function(req, res, next){
  res.render('users/register');
})
router.post('/register', userController.addUser);

router.get('/profile', userController.profile);
router.post('/profile', userController.update_profile);


module.exports = router;
