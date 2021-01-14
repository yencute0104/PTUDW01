const app = require('../app');
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
//router.get('/add_to_cart/:id',cartController.add_to_cart);

// hiển thị danh sách giỏ hàng
router.get('/listcart',cartController.listcart);

// xóa sản phẩm khỏi giỏ hàng
router.get('/listcart/remove/:id', cartController.deleteItem);

// giảm số lượng của 1 sản phẩm trong giỏ hàng
router.get('/listcart/decrease/:id', cartController.decreaseItem);

// tăng số lượng của 1 sản phẩm trong giỏ hàng
router.get('/listcart/increase/:id', cartController.increaseItem);

// hiển thị checkout của giỏ hàng để điền thông tin mua hàng
router.get('/checkout',checkAuthentication, cartController.checkout);

// sau khi bấm mua hàng, xử lý nhận thông tin để tạo đơn hàng
router.post('/checkout',checkAuthentication, orderController.createOrder);

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/users/login");
    }
  }

module.exports = router;