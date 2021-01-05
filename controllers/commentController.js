const { ObjectId } = require('mongodb');

const commentModel = require('../models/commentModel');
const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');
exports.add_comment = async(req, res, next) => {
    const bookID = req.params.id;
    const nickname = req.body.nickname ? req.body.nickname: req.user.username;
    const content = req.body.content;

    if ((await userModel.getNameUser(nickname) && !req.user) || nickname === "Quản trị viên")
    {
        
        const category =  await bookModel.listcategory();
        const bookID = req.params.id;
        const book = await bookModel.get(bookID);
        const bookCat = await bookModel.get_name_cat(book.catID);
        const relatedBook = await bookModel.getRelatedBooks(book.catID, bookID);
        // const comment = book.comment ? book.comment:[];

        const perpage = 5;
    const current = parseInt(req.query.page) || 1;
    const comment = await bookModel.listcomment(bookID, current, perpage);
    const count_comment = book.comment.length || 0;    
    const pages = Math.ceil(count_comment/perpage); 
    const nextPage = current < pages ? (current+1): current;
    const prevPage = current > 1 ? (current-1): 1;
    const hasNextPage = current < pages;  
    const hasPreviousPage = current > 1;
    var avatar;
    for (id in comment)
    {
        avatar = await userModel.getProfilePicUser(comment[id].nickname);
        if (avatar)
            comment[id].avatar = avatar;
    }
        return res.render('./books/detail', 
        {   
            title: "Chi tiết",
            category,
            book,
            bookID,
            bookCat,
            relatedBook,
            countRelatedBooks: relatedBook.length,
            comment,
            show_active_2: "show active",
            err: "Nickname đã được sử dụng, vui lòng dùng tên khác",
            content,
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

    }
        
     // lấy cuốn sách từ id và thêm vào comment
    const book = await bookModel.get(bookID);
    const comment = book.comment ? book.comment : [];
    const cmt = {nickname: nickname, content: content, avatar: ""};
    comment.push(cmt);
    bookModel.add_comment(bookID, comment);

    res.redirect('../' + bookID);
};