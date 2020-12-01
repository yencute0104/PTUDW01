const bookModel = require('../models/bookModel');

exports.index = async (req, res, next) => {
    // Get books from model
    const books = await bookModel.list();
    // Pass data to view to display list of books
    res.render('index', {books});
};