const app = require('../app');
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.get('/', orderController.index);
router.get('/:id', orderController.detailOrder);
router.get('/cancel/:id', orderController.cancelOrder);
module.exports = router;