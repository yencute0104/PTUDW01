var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const listController = require('../controllers/listController');

/* GET list of books. */
router.get('/', indexController.index);
router.get('/home', indexController.index);
router.get('/account', userController.account);
router.get('/listbook', listController.index);
router.get('/:id',listController.detail );

//router.get('/:id', listController.detail);
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('books/list', { title: 'Trang chủ' });
// });

module.exports = router;
