const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const mongoosePaginate = require('mongoose-paginate-v2');
const {Schema} = mongoose;

const book = new Schema(
{
    title: String,
    unsigned_title: String,
    cover: String,
    listCover: Array,
    storeNumber: Number,
    saleNumber: Number,
    oldPrice: String,
    basePrice: Number,
    detail: String,
    descript: String,
    author: Array,
    status: String,
    catogory: String,
    catID: ObjectId,
    isDeleted: Boolean,
    comment: Array
},
  {collection: 'Books'}
  );

  book.plugin(mongoosePaginate);

  module.exports = mongoose.model('Books', book);