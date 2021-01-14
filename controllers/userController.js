const userModel = require('../models/userModel');
const fs = require('fs');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
const fileupload = require('express-fileupload');
const crypto = require('crypto'); 
const { promisify } = require('util');
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid-transport');
// const transport = nodemailer.createTransport('SMTP', {service: 'Gmail',
//     auth: {
//   user: "yencute0104@gmail.com",  // my actual email address here
//   pass: "tanghoangyen"   // my actual password here
// }
//     // auth: {
//     // api_key: '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'}
// });

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

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}{|gmail.com|yahoo.com|}))$/;
    return re.test(email);
}

exports.index = (req, res, next) => {
    res.render('users/login',{title: 'Đăng Nhập'});
};

exports.profile = async(req, res, next) => {
 
     res.render('users/profile',{title: 'Profile'}); 
};

exports.change_password_page = (req, res, next) => {
        res.render('users/change_password',{ title: 'Đổi mật khẩu'}); 
};

exports.change_password = async (req, res, next) => {
    const {oldPassword, newPassword, renewPassword} = req.body;
    const isTruePassword = await userModel.checkCredential(req.user.username, oldPassword);
    console.log(req.user.username);
    try
    {
        if (isTruePassword)
        {
            if (newPassword != showUnsignedString(newPassword))
            {
                throw("Mật khẩu không được có dấu");
                return;
            }
    
            if (newPassword.includes(' '))
            {
                throw("Mật khấu không được chứa khoảng trắng");
                return;
            }

            if (newPassword.length <8)
            {
                throw("Mật khấu chứa ít nhất 8 kí tự");
                return;
            }

            if (newPassword != renewPassword)
            {
                throw("Mật khấu nhập lại không đúng");
                return;
            }

            await userModel.change_password(req.user.username, newPassword);
            res.render('users/change_password', {title: 'Đổi mật khẩu', messageSuccess: "Đổi mật khẩu thành công!"});

        }
        else
        {
            throw ("Mật khẩu cũ không đúng");
            return;
        }
    }
    catch (err)
    {
        res.render('users/change_password',{ title: 'Đổi mật khẩu', message: err}); 
    }
   
  
};

exports.update_profile = async(req, res, next) => {
    
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
          next(err);
          return;
        }

        // update email ko hợp lệ
        const email = fields.txtEmail;
        if (!validateEmail(email))
        {
            return res.render('users/profile',{title: 'Profile', message: "Email không hợp lệ!"});
        }

        const coverImage = files.txtProfilePic;
        const imageType = ["image/png", "image/jpeg"];

        // ảnh bìa phải là 1 file ảnh
      
        if (coverImage && coverImage.size > 0) 
        {
            if (imageType.indexOf(coverImage.type) >=0 )  
            {

            cloudinary.uploader.upload(coverImage.path,function(err, result){
                fields.txtProfilePic = result.url;
                userModel.update_profile(fields,req.params.id).then(()=>{
                    res.redirect('../../');
                    });
            });
            }
            else
                userModel.update_profile(fields,req.params.id).then(()=>{
                res.redirect('../../');
                });

        }
        else
        {
            userModel.update_profile(fields,req.params.id).then(()=>{
                res.redirect('../../');
                });
        }
      });
};

exports.addUser = async (req, res) => {
 
    const {username, email, password, repassword} = req.body;



    const newUser = {
        username,
        email,
        password,
        repassword
    };

    try {
        req.checkBody('password','Mật khẩu phải có ít nhất 8 kí tự').isLength({min:8});
        const err = req.validationErrors();
        if (err)
        {
            throw("Mật khẩu phải có ít nhất 8 kí tự");
            return;
        }
            
        const checkUsername = await userModel.getNameUser(username);
        const checkEmail = await userModel.getEmailUser(email);

        if (!validateEmail(email))
        {
            throw("Email không hợp lệ!");
            return;
        }

        if (!checkUsername && !checkEmail)
        {
            if (username === showUnsignedString(username))
            {
                if (password != showUnsignedString(password))
                {
                    throw("Mật khẩu không được có dấu");
                    return;
                }

                if (password.includes(' '))
                {
                    throw("Mật khấu không được chứa khoảng trắng");
                    return;
                }
                
                if (password === repassword)
                {
                    await userModel.addUser(newUser);
                    res.render('users/register',{title: "Đăng ký", messageSuccess: "Đăng ký thành công!" });
                    // res.redirect('/users/login');
                }
                else
                {
                    throw("Mật khẩu nhập lại không đúng");
                    return;
                }
            }
            else 
            {
                throw("Tên đăng nhập không được có dấu");
            }
        }
        else 
        {
            throw("Lỗi không thể tạo tài khoản do tên đăng nhập hoặc email đã tồn tại");
            return;
        }
        
    }
    catch (err)
    {
        const message = err;
        res.render('users/register',{title: "Đăng ký", message, hasErr: message.length >0, username, email, password });
        return;
    }
};


exports.forget_pw = async (req, res, next) => {

    const token = (crypto.randomBytes)(20).toString('hex');
    // const existUsername = await userModel.getNameUser(req.body.username);
    // const existEmail = await userModel.getEmailUser(req.body.email);
    // var user = (existUsername && existEmail);

    const user = await userModel.get(req.body.username, req.body.email);

    if (!user) {
        req.flash('error', 'No account with that email address exists.');
        return res.redirect('../forgot');
    }

    await userModel.update_resetpw(user, token);
    //http://${req.headers.host}/reset/${token}
    const resetEmail = {
        to: user.email,
        from: 'yencute0104@gmail.com',
        subject: 'Đổi mật khẩu',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
        Please click on the following link, or paste this into your browser to complete the process:
        http://localhost:4000/users/reset/${token}
        If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    await transport.sendMail(resetEmail);
    req.flash('info', `An e-mail has been sent to ${user.email} with further instructions.`);
    res.redirect('../forgot');
};


exports.reset = async(req, res, next)=> {
    const user = await userModel.find(req.params.token);
    
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('../forgot');
      }
    
      //res.setHeader('Content-type', 'text/html');
    //   res.end(templates.layout(`
    //     ${templates.error(req.flash())}
    //     ${templates.resetPassword(user.resetPasswordToken)}
    //   `));
    res.rend();
};

exports.reset_pw = async(req, res, next)=>{
    const user = await userModel.find(req.params.token);
    
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
    
      user.password = req.body.password;
      delete user.resetPasswordToken;
      delete user.resetPasswordExpires;
    
      const resetEmail = {
        to: user.email,
        from: 'passwordreset@example.com',
        subject: 'Your password has been changed',
        text: `
          This is a confirmation that the password for your account "${user.email}" has just been changed.
        `,
      };
    
      await transport.sendMail(resetEmail);
      req.flash('success', `Success! Your password has been changed.`);
    
      res.redirect('/');
};