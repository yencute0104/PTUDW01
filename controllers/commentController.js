const { ObjectId } = require('mongodb');

const commentModel = require('../models/commentModel');
const bookModel = require('../models/bookModel');

exports.add_comment = async(req, res, next) => {
    const bookID = req.params.id;
    const nickname = req.body.nickname ? req.body.nickname: req.user.username;
    const content = req.body.content;
    

     //await commentModel.add_comment(bookID, nickname, content);

     // lấy cuốn sách từ id và thêm vào comment
    const book = await bookModel.get(bookID);
    const comment = book.comment ? book.comment : [];
    const cmt = {nickname: nickname, content: content, avatar: ""};
    comment.push(cmt);
    bookModel.add_comment(bookID, comment);

    res.redirect('../' + bookID);
};