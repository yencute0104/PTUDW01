const passport = require('passport');
const passportGoogle = require('passport-google-oauth');
LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = passportGoogle.OAuth2Strategy;
//const session = require('express-session');

const userModel = require('../models/userModel');
const cartModel = require('../models/cartModel');

passport.use(new LocalStrategy(
    {passReqToCallback: true},
    async function(req, username, password, done) {
    const user = await userModel.checkCredential(username, password);
    
    if (!user)
        return done(null, false, {message: 'Tên đăng nhập hoặc mật khẩu không đúng'});

    const isBlocked = await userModel.checkIsBlocked(username);

    if (isBlocked)
        return done(null, false, {message: 'Tài khoản hiện đã bị khóa'});

    if (req.session.cart)
    {
        const cart = new cartModel(req.session.cart);
        await userModel.createCart(user._id, cart);
    }
    
    console.log(user.username);
      
    return done(null, user);
    }
));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/users/auth/google/callback`
  }, (accessToken, refreshToken, profile, cb) => {
    const user = {
      id: `google/${profile.id}`,
      email: profile.email,
      fullName: profile.displayName,
      profile,
      tokens: { accessToken, refreshToken },
    };
   
    users.push(user);
    cb(null, user);
  }));
  

passport.serializeUser(function(user, done) {
    done(null, user._id);
});
  
passport.deserializeUser(function(id, done) {
    userModel.getUser(id).then((user)=>{
        done(null, user);
    })
   
});

module.exports = passport;