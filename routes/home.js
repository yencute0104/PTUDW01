var express = require('express');
const { route } = require('.');
var router = express.Router();

const indexController = require('../controllers/listController');
const userController = require('../controllers/userController');
const listController = require('../controllers/listController');
/* GET list of books. */
router.get('/', indexController.index);
router.get('/:id',listController.detail);


module.exports = router;
