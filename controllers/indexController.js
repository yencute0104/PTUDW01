const bookModel = require('../models/bookModel');
const listController = require('../controllers/listController');

exports.index = async (req, res, next) => {
    const search = req.query.search;
    // Get books from model
    const books = await bookModel.list();
    const bestseller = await bookModel.listStatus("Bán chạy");
    const newproduct = await bookModel.listStatus("Sản phẩm mới");
    if (search)
    {
        res.redirect('/listbook?search='+search);
    }
    else
    // Pass data to view to display list of books
        res.render('index', {title: "Trang chủ", books, bestseller, newproduct});
};