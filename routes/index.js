const app = require('../app');
const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexController');
const listController = require('../controllers/listController');
const userController = require('../controllers/userController');

const listbookRouter = require('../routes/listbook');
const userRouter = require('../routes/users');

/* GET list of books. */
router.get('/', indexController.index);
router.get('/home', indexController.index);

router.use('/listbook', listbookRouter);
router.use('/account',userRouter);
router.get('/:id',listController.detail );

module.exports = router;
