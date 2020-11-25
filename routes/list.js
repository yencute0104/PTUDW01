var express = require('express');
var router = express.Router();
const listController = require('../controllers/listController');

/* GET list of books. */
router.get('/', listController.index);
router.get('/:id',listController.detail);
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('books/list', { title: 'Trang chủ' });
// });

module.exports = router;