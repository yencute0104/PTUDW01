const { ObjectId} = require('mongodb');
const orderCollection = require('./MongooseModel/orderMongooseModel');

exports.createOrder = async (newOrder) => {
    await orderCollection.create({
        userID: ObjectId(newOrder.id),
        city: newOrder.city,
        district: newOrder.district,
        ward: newOrder.ward,
        address: newOrder.address,
        cart: newOrder.cart,
        totalOrder: newOrder.totalOrder,
        status: "Đợi duyệt"
    });
}