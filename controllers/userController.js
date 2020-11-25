//const bookModel = require('../models/bookModel');

exports.account = (req, res, next) => {
    // Get books from model
    //const books = bookModel.list();
    // Pass data to view to display list of books
    res.render('account');
};