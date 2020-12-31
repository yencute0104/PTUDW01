const passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
//const session = require('express-session');

const userModel = require('../models/userModel');
const cartModel = require('../models/cartModel');

passport.use(new LocalStrategy(
    {passReqToCallback: true},
    async function(req, username, password, done) {
    const user = await userModel.checkCredential(username, password);
    
    if (!user)
        return done(null, false, {message: 'Tên đăng nhập hoặc mật khẩu không đúng'});

    if (req.session.cart)
    {
        const cart = new cartModel(req.session.cart);
        await userModel.createCart(user._id, cart);
    }
    const hasProfilePic = user.profilePic != "";
    return done(null, user, {hasProfilePic: hasProfilePic});
    }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});
  
passport.deserializeUser(function(id, done) {
    userModel.getUser(id).then((user,err)=>{
        done(err, user);
    })
   
});

module.exports = passport;