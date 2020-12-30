const { ObjectId } = require('mongodb');

const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');

exports.createOrder = async (req,res,next) => {
    const {firstName, lastName, phone, city, district, ward, address} = req.body;
    const cart = req.user.cart;
    const id = req.user._id;
    const totalOrder = req.user.cart.totalPrice + parseInt(30000);
    const newOrder = {
        id, firstName, lastName, phone, city, district, ward, address, cart, totalOrder
    }
    await orderModel.createOrder(newOrder);
    await userModel.createCart(req.user._id, null);
    //req.flash('success','Đơn hàng đã đặt thành công');
    res.redirect('../../carts/listcart');
};
