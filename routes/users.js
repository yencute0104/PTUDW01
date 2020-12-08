var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', userController.index);

router.get('/login', function(req, res, next){
  res.render('users/login');
})

router.get('/register', function(req, res, next){
  res.render('users/register');
})

router.get('/profile', userController.profile);
router.post('/profile', userController.update_profile);


module.exports = router;
