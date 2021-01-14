const express = require('express');
const router = express.Router();

const passport = require('../passport');
const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController');
const orderRouter = require('../routes/order');


router.get('/', function(req, res, next){
  const message = req.flash('error');
  res.render('error',{title: 'Error', message, hasErr: message.length > 0});
});

// đổi tài khoản, cần logout và hiển thị form đăng nhập
router.get('/switch_login', function(req, res, next){
  req.logout();
  res.redirect('login');
});

// hiển thị form đăng nhập
router.get('/login', function(req, res, next){
  const message = req.flash('error');
  res.render('users/login',{title: 'Đăng nhập', message, hasErr: message.length > 0});
});

// kiểm tra thông tin đăng nhập
router.post('/login', passport.authenticate('local', { 
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true}));

// hiển thị form đăng ký
router.get('/register', function(req, res, next){
  res.render('users/register',{title: 'Đăng ký'});
})

router.post('/register', userController.addUser);

router.get('/forget', isNotLogined, function(req, res, next){
  res.render('users/forget',{title: 'Lấy lại mật khẩu'});
})
router.post('/forget', userController.forget_pw);

router.get('/forget/:token', userController.reset_pw);

router.get('/reset/:id', isNotLogined, function(req, res, next){
  res.render('users/reset');
});
router.post('/reset/:id', userController.reset);

// router.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/users/login' }),
//   (req, res) => res.redirect('/'));

// hiển thị trang thông tin cá nhân của người dùng
router.get('/profile/:id', checkAuthentication, userController.profile);

// lấy thông tin chỉnh sửa trang cá nhân của người dùng
router.post('/profile/:id', userController.update_profile);

// hiển thị trang thay đổi password
router.get('/change_password/:id',checkAuthentication, userController.change_password_page);

// lấy thông tin để thực hiện đổi mật khẩu
router.post('/change_password/:id',checkAuthentication, userController.change_password);

router.get('/logout', checkAuthentication, function(req,res,next){
  req.logout();
  res.redirect('/');
});

// điều hướng qua đơn hàng
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
