const app = require('../app');
var express = require('express');
var router = express.Router();

const listController = require('../controllers/listController');
const cartController = require('../controllers/cartController');
const commentController = require('../controllers/commentController');

// hiển thị danh sách sp
router.get('/', listController.index);

// xem chi tiết cuốn sách
router.get('/:id',listController.detail);

// thêm 1 cuốn sách vào giỏ hàng
router.post('/:id',cartController.add_to_cart);


// router.get('add_to_cart/:id',cartController.add_to_cart);

// thêm 1 bình luận cho cuốn sách đó
router.post('/submit_comment/:id', commentController.add_comment);

module.exports = router;