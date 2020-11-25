const bookModel = require('../models/bookModel');


exports.index = (req, res, next) => {
    // Get books from model
    const books = bookModel.list();
    // Pass data to view to display list of books
    res.render('list', {books});
};

exports.detail = (req,res, next) => {
    
    res.render('detail', bookModel.get(req.params.id)) ;
};