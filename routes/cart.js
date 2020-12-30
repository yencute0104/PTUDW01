const app = require('../app');
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
//router.get('/add_to_cart/:id',cartController.add_to_cart);

router.get('/listcart',cartController.listcart);
router.get('/listcart/remove/:id', cartController.deleteItem);
router.get('/checkout',checkAuthentication, function(req,res,next){
    res.render('checkout',{title: 'Mua hàng'});
});

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/users/login");
    }
  }

module.exports = router;