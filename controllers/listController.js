const { render } = require('../app');
const bookModel = require('../models/bookModel');

exports.index = async (req, res, next) => {
    // Get books from model
    const books = await bookModel.list();
    //console.log('books', books);
    // Pass data to view to display list of books
    res.render('list', {books});
};

exports.detail = async (req, res, next) => {
    res.render('detail', await bookModel.get(req.params.id));
  
}

// exports.index = (req, res, next) => {
//     // Get books from model
//     const books =  bookModel.list();
//     // Pass data to view to display list of books
//     res.render('list', {books});
// };

// exports.detail = (req,res, next) => {
    
//     res.render('detail', bookModel.get(parseInt(req.params.id))) ;
// };