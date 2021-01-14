const app = require('../app');
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// danh sách đơn hàng của 1 ng dùng
router.get('/', orderController.index);

// hiển thị chi tiết 1 đơn hàng
router.get('/:id', orderController.detailOrder);

// hủy đơn hàng
router.get('/cancel/:id', orderController.cancelOrder);
module.exports = router;