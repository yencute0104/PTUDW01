const app = require('../app');
const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexController');
const listController = require('../controllers/listController');
const userController = require('../controllers/userController');

const listbookRouter = require('../routes/listbook');
const userRouter = require('../routes/users');


// hiển thị trang chủ
router.get('/', indexController.index);
router.get('/home', indexController.index);

// điều hướng về booksrouter, xử lý các hoạt động liên quan tới ds sp
router.use('/listbook', listbookRouter);

// xem chi tiết 1 sản phẩm ngoài trang chủ
router.get('/:id',listController.detail );

module.exports = router;
