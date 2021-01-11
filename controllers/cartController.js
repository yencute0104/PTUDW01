
const { ObjectId } = require('mongodb');

const bookModel = require('../models/bookModel');
const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');

exports.add_to_cart = async (req, res, next) => {
    const bookID = req.params.id;
    const qty = parseInt(req.body.qty);
    const user = req.user;
    var cart;
    const book = await bookModel.get(bookID);
    
    
    if (!book)
        return res.redirect('/');

    if (user)
    {
        cart = new cartModel(user.cart ? user.cart : {});
    }
    else
    {
        cart = new cartModel(req.session.cart ? req.session.cart : {});
    }

    cart.add(book, book._id, qty);
    
    if (user)
        userModel.createCart(user._id, cart);
    else
        req.session.cart = cart;
    res.redirect('../../listbook/' + bookID);
    
};

exports.listcart = async (req, res, next) => {
    var cart;
    const message = req.flash('success');
    const error_1 = req.flash('error_1');

    if (req.user)
    {
        if (!req.user.cart)
            return res.render('cart',{title: 'Giỏ hàng', books: null, message});
        cart = new cartModel(req.user.cart);
    }
    else
    {
        if (!req.session.cart)
            return res.render('cart',{title: 'Giỏ hàng', books: null});
        cart = new cartModel(req.session.cart);
    }
    
    res.render('cart',{title: 'Giỏ hàng', books: cart.generateArray(), totalPrice: cart.totalPrice, error_1});
   
};

exports.deleteItem = async (req, res, next) => {
    const user = req.user;
    var cart;

    if (user)
    {
        cart = new cartModel(user.cart);
    }
    else 
        cart = new cartModel(req.session.cart);

    const book = await bookModel.get(req.params.id);
    cart.deleteItem(book._id);

    if (user)
        userModel.createCart(user._id, cart);
    else
        req.session.cart = cart;

    res.redirect('../../listcart');
};

exports.decreaseItem = async (req, res, next) => {
    const user = req.user;
    const book = await bookModel.get(req.params.id);
    var cart;

    if (user)
    {
        cart = new cartModel(user.cart);
    }
    else 
        cart = new cartModel(req.session.cart);

    if (cart.items[book._id].qty === 1)
        return res.redirect('../../listcart');
    
    cart.decreaseItem(book._id);
    if (user)
        userModel.createCart(user._id, cart);
    else
        req.session.cart = cart;

    res.redirect('../../listcart');
};

exports.increaseItem = async (req, res, next) => {
    const user = req.user;
    const book = await bookModel.get(req.params.id);
    var cart;

    if (user)
    {
        cart = new cartModel(user.cart);
    }
    else 
        cart = new cartModel(req.session.cart);

    // const book = await bookModel.get(req.params.id);
    if (cart.items[book._id].qty >= book.storeNumber)
    {
        return res.redirect('../../listcart');
    }
       

    cart.increaseItem(book._id);

    if (user)
        userModel.createCart(user._id, cart);
    else
        req.session.cart = cart;

    res.redirect('../../listcart');
};
exports.checkout =async (req,res,next) =>{
    if (req.user.cart)
    {
        // kiểm tra số lượng hiện tại có nhỏ hơn số sách trong kho ko, nếu ko hiển thị thông báo yêu cầu ng dùng sửa
        const cart = new cartModel(req.user.cart);
        for (var index in cart.items) 
        {
            const book = await bookModel.get(cart.items[index].item._id);
            if (cart.items[index].qty > book.storeNumber) 
            {
                req.flash('error_1','Sách ' + book.title + ' vượt quá số lượng trong kho, vui lòng kiểm tra lại.' );   
                return res.redirect('/carts/listcart');           
            }
        }

        res.render('checkout',{
        title: 'Mua hàng', 
        books: cart.generateArray(), 
        totalPrice: cart.totalPrice,
        totalOrder: cart.totalPrice + parseInt(30000)
        })
    }
    else    
        res.render('cart',{title: 'Giỏ hàng'});
    
};

