const mongoose = require('mongoose');
const {Schema} = mongoose;

const user = new Schema(
{
    firstName: String,
    lastName: String,
    email: String,
    pass: String,
    phone: String,
    lastName: String,
    address: String,
    profilePic: String,
},
  {collection: 'Users'}
  );

  module.exports = mongoose.model('Users', user);