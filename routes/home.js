var express = require('express');
var router = express.Router();
const indexController = require('../controllers/bookController');
const userController = require('../controllers/userController');
/* GET list of books. */
router.get('/', indexController.index);
router.get('/account', userController.account);
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('books/list', { title: 'Trang chủ' });
// });

module.exports = router;
