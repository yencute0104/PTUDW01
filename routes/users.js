const express = require('express');
const router = express.Router();

const passport = require('../passport');
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', userController.index);

router.get('/login', function(req, res, next){
  res.render('users/login',{title: 'Đăng nhập'});
})

router.post('/login',  passport.authenticate('local', { successRedirect: '/',
failureRedirect: '/users/login',
failureFlash: false}))

router.get('/register', function(req, res, next){
  res.render('users/register',{title: 'Đăng ký'});
})
router.post('/register', userController.addUser);

router.get('/profile/:id', userController.profile);
router.post('/profile/:id', userController.update_profile);

router.get('/logout', function(req,res,next){
  req.logout();
  res.redirect('/');
})
module.exports = router;
