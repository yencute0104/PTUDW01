const { render } = require('../app');
const bookModel = require('../models/bookModel');
const { ObjectId } = require('mongodb');
const item_per_page = 2;

exports.index = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search;
    var nameCat =  "Thể loại";
    var catid = req.query.catid;
    if (catid)
    {
        var catID =  ObjectId(catid);
        var tmp_nameCat = await bookModel.get_name_cat(catid);
    }
    if (tmp_nameCat)
       nameCat = tmp_nameCat;
    const filter = {};
    if (catid)
    {
        filter.catID = ObjectId(catid);
    }
    if (search)
    {
        filter.title = new RegExp(search, 'i');
    }

    filter.isDeleted =  false;
    
    const paginate = await bookModel.listbook(filter,page,item_per_page);
    const category =  await bookModel.listcategory();
    res.render('./listbook', {
        title: "Sách",
        books: paginate.docs,
        totalBooks: paginate.totalDocs,
        category,
        nameCat,
        catID,
        nameSearch: search,
        hasNextPage: paginate.hasNextPage,
        nextPage: paginate.nextPage,
        hasPreviousPage: paginate.hasPrevPage,
        prevPage: paginate.prevPage,
        lastPage: paginate.totalPages,
        ITEM_PER_PAGE: item_per_page,
        currentPage: paginate.page,
    })};


exports.detail = async (req, res, next) => {
    const category =  await bookModel.listcategory();
    const book = await bookModel.get(req.params.id);
    res.render('./detail', 
    {   
        title: "Chi tiết",
        category,
        book : book
    });
  
};

// exports.index = (req, res, next) => {
//     // Get books from model
//     const books =  bookModel.list();
//     // Pass data to view to display list of books
//     res.render('list', {books});
// };

// exports.detail = (req,res, next) => {
    
//     res.render('detail', bookModel.get(parseInt(req.params.id))) ;
//};
