const express = require('express');
const router = express.Router();

const passport = require('../passport');
const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController');
const orderRouter = require('../routes/order');
/* GET users listing. */
// router.get('/', function(req, res, next){
//   const message = req.flash('error');
//   res.render('users/login',{title: 'Đăng nhập', message, hasErr: message.length > 0});
// });

router.get('/', function(req, res, next){
  const message = req.flash('error');
  res.render('error',{title: 'Error', message, hasErr: message.length > 0});
});

router.get('/switch_login', function(req, res, next){
  req.logout();
  res.redirect('login');
});

router.get('/login', function(req, res, next){
  const message = req.flash('error');
  res.render('users/login',{title: 'Đăng nhập', message, hasErr: message.length > 0});
});

router.post('/login', passport.authenticate('local', { 
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true}));

router.get('/register', function(req, res, next){
  res.render('users/register',{title: 'Đăng ký'});
})
router.post('/register', userController.addUser);

// router.get('/forget', isNotLogined, function(req, res, next){
//   res.render('users/forget',{title: 'Lấy lại mật khẩu'});
// })
// router.post('/forget', userController.forget_pw);

// router.get('/reset/:token', userController.reset);
// router.post('/reset/:token', userController.reset_pw);

// router.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/users/login' }),
//   (req, res) => res.redirect('/'));

router.get('/profile/:id', checkAuthentication, userController.profile);
router.post('/profile/:id', userController.update_profile);

router.get('/change_password/:id',checkAuthentication, userController.change_password_page);
router.post('/change_password/:id',checkAuthentication, userController.change_password);

router.get('/logout', checkAuthentication, function(req,res,next){
  req.logout();
  res.redirect('/');
});

router.use('/order', checkAuthentication , orderRouter);

function checkAuthentication(req,res,next){
  if(req.isAuthenticated()){
      next();
  } else{
      res.redirect("/users/login");
  }
}

function isNotLogined(req,res,next){
  if(req.isAuthenticated()){
    res.redirect("/");
  } else{
      next();
  }
}
module.exports = router;
