const { ObjectId } = require('mongodb');

const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');

exports.index = async (req, res, next) =>{
    //const listorder = await orderModel.getListOrder(req.user._id);
    const listorder_pending = await orderModel.getListOrderWithStatus(req.user._id, "Đợi duyệt");
    const listorder_delivering = await orderModel.getListOrderWithStatus(req.user._id, "Đang giao");
    const listorder_delivered = await orderModel.getListOrderWithStatus(req.user._id, "Đã giao");
    const listorder_canceled = await orderModel.getListOrderWithStatus(req.user._id, "Hủy");
    var count = 0;
    count = listorder_delivered || listorder_delivering || listorder_pending || listorder_canceled;

    res.render('orders/order',{title: 'Đơn hàng', 
    count,
    orders_pending: listorder_pending, 
    orders_delivering: listorder_delivering, 
    orders_delivered: listorder_delivered,
    orders_canceled: listorder_canceled
    });
};

exports.detailOrder = async (req, res, next) => {
    const orderID = req.params.id;
    const order = await orderModel.getOrder(orderID);
    const address = order.address +', ' + order.ward + ', ' + order.district + ', ' + order.city;
    const isWaiting = order.status === "Đợi duyệt";
    res.render('orders/detailOrder', {title: 'Chi tiết đơn hàng', order: order, address: address, isWaiting, status: order.status});
};

exports.createOrder = async (req,res,next) => {
    const {firstName, lastName, phone, city, district, ward, address} = req.body;
    var cart = req.user.cart;
    const id = req.user._id;
    const username = req.user.username;
    const totalOrder = req.user.cart.totalPrice + parseInt(30000);
    const newOrder = {
        id, username, firstName, lastName, phone, city, district, ward, address, cart, totalOrder
    }
    await orderModel.createOrder(newOrder, new cartModel(cart).generateArray());

    await userModel.createCart(req.user._id, null);
    req.flash('success','Đơn hàng đã đặt thành công');
    res.redirect('../../carts/listcart');
};

exports.cancelOrder = async (req,res,next) => {
    const orderID = req.params.id;
    await orderModel.cancelOrder(orderID);
    res.redirect('/users/order');
};
