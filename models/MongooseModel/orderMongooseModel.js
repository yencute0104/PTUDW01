const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const order = new Schema(
{
    userID: ObjectId,
    district: String,
    ward: String,
    city: String,
    address: String,
    status: String,
    totalOrder: String,
    cart: Object
},
  {collection: 'Orders'}
  );

  module.exports = mongoose.model('Orders', order);