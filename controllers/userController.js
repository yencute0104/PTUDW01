const userModel = require('../models/userModel');
const fs = require('fs');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
const fileupload = require('express-fileupload');

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
        //  // Update books from model
        // console.log(tmp);
        // userModel.update_profile(fields,ID).then(()=>{
        // res.redirect('../../');
        // });
        
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
