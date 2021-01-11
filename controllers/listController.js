const { render } = require('../app');
const { ObjectId } = require('mongodb');
const queryString = require('query-string');
const buildUrl = require('build-url');

const bookModel = require('../models/bookModel');
const commentModel = require('../models/commentModel');
const userModel = require('../models/userModel');
const { Query } = require('mongoose');
const item_per_page = 6;

function showUnsignedString(search) {
    var signedChars = "àảãáạăằẳẵắặâầẩẫấậđèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬĐÈẺẼÉẸÊỀỂỄẾỆÌỈĨÍỊÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢÙỦŨÚỤƯỪỬỮỨỰỲỶỸÝỴ";
    var unsignedChars = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAADEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYY";
    var input = search;
    var pattern = new RegExp("[" + signedChars + "]", "g");
    var output = input.replace(pattern, function(m, key, value) {
        return unsignedChars.charAt(signedChars.indexOf(m));
    });
    return output;
}
exports.index = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search;
    const sort= parseInt(req.query.sort) || 0;

    const nameSortArr = ["Từ A->Z", "Từ Z->A", "Giá tăng dần", "Giá giảm dần"];

    var nameCat =  "Thể loại";
    var catid = req.query.catid;

    if (catid)
    {
        var catID =  ObjectId(catid);
        var tmp_nameCat = await bookModel.get_name_cat(catid);
    }
    if (tmp_nameCat)
       nameCat = tmp_nameCat;

    //const filter = {};
    var filter = {isDeleted: false};

    if (catid)
    {
        if (nameCat != "Tất cả")
        {
            if (search)
            {
                const searchval = new RegExp(search, 'i');
                const searchval1 = new RegExp(showUnsignedString(search), 'i');
                filter = {$or: [
                                {title: searchval }, 
                                { detail: searchval}, 
                                {author: searchval}, 
                                {unsigned_title: searchval1 }],
                                catID: ObjectId(catid), isDeleted: false};
            }
            else
                filter = {catID: ObjectId(catid), isDeleted: false};
        }  
        else
        {
            if (search)
            {
                const searchval = new RegExp(search, 'i');
                const searchval1 = new RegExp(showUnsignedString(search), 'i');
                filter = {$or: [
                                {title: searchval }, 
                                { detail: searchval}, 
                                {author: searchval}, 
                                {unsigned_title: searchval1 }],
                                isDeleted: false};
            }
            
        }        
    }
    else
    {
        if (search)
        {
            const searchval = new RegExp(search, 'i');
            const searchval1 = new RegExp(showUnsignedString(search), 'i');
            filter = {$or: [
                            {title: searchval }, 
                            { detail: searchval}, 
                            {author: searchval}, 
                            {unsigned_title: searchval1 }],
                            isDeleted: false};
        }
    }
    
    const paginate = await bookModel.listbook(filter,page,item_per_page, sort);
    const category =  await bookModel.listcategory();

    // for (index in category)
    //     category[index].nameSearch = search;
  
    const prevPageQueryString = {...req.query, page:paginate.prevPage};
    const nextPageQueryString = {...req.query, page:paginate.nextPage};
    
    res.render('./books/listbook', {
        title: "Sách",
        books: paginate.docs,
        totalBooks: paginate.totalDocs,
        category,
        nameCat,
        catID,
        nameSort: nameSortArr[sort],
        nameSearch: search,
        hasNextPage: paginate.hasNextPage,
        nextPage: paginate.nextPage,
        nextPageQueryString: queryString.stringify(nextPageQueryString),
        hasPreviousPage: paginate.hasPrevPage,
        prevPage: paginate.prevPage,
        prevPageQueryString: queryString.stringify(prevPageQueryString),
        lastPage: paginate.totalPages,
        ITEM_PER_PAGE: item_per_page,
        currentPage: paginate.page,
        //querystring: querystring
    })};


exports.detail = async (req, res, next) => {
    const category =  await bookModel.listcategory();
    const bookID = req.params.id;
    const book = await bookModel.get(bookID);
    const bookCat = await bookModel.get_name_cat(book.catID);
    const relatedBook = await bookModel.getRelatedBooks(book.catID, bookID);
    //const comment = book.comment ? book.comment:[];
    const listCover = book.listCover;

    // tính toán phân trang bình luận
    const perpage = 5;
    const current = parseInt(req.query.page) || 1;
    const comment = await bookModel.listcomment(bookID, current, perpage);
    const count_comment = book.comment.length || 0;    
    const pages = Math.ceil(count_comment/perpage); 
    const nextPage = current < pages ? (current+1): current;
    const prevPage = current > 1 ? (current-1): 1;
    const hasNextPage = current < pages;  
    const hasPreviousPage = current > 1;

    // tìm avatar của người bình luận nếu có
    var avatar;
    for (id in comment)
    {
        avatar = await userModel.getProfilePicUser(comment[id].nickname);
        if (avatar)
            comment[id].avatar = avatar;
    }

    res.render('./books/detail', 
    {   
        title: "Chi tiết",
        category,
        book,
        bookID,
        listCover,
        bookCat,
        relatedBook,
        countRelatedBooks: relatedBook.length,
        comment: comment,
        current,
        nextPage,
        prevPage,
        totalComments: count_comment,
        pages,
        hasNextPage,
        hasPreviousPage,
        lastPage: pages,
        show_active_2: "show active"
    });
  
};

