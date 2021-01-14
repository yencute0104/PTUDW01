const userModel = require('../models/userModel');
const fs = require('fs');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
const fileupload = require('express-fileupload');

const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";
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

    const { email, username } = req.body;

    let errors = [];

    //------------ Checking required fields ------------//
    if (!email || !username) {
        errors.push({ msg: 'Vui lòng điền đủ thông tin' });
    }

    if (errors.length > 0) {
        res.render('users/forget', {
            errors,
            email,
            username
        });
    } else {
        const user = await userModel.get(username, email);
            if (!user) {
                //------------ User already exists ------------//
                errors.push({ msg: 'Không tồn tại username hoặc email' });
                res.render('users/forget', {
                    errors,
                    email,
                    username
                });
            } else {

                const oauth2Client = new OAuth2(
                    "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com", // ClientID
                    "OKXIYR14wBB_zumf30EC__iJ", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );

                oauth2Client.setCredentials({
                    refresh_token: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w"
                });
                const accessToken = oauth2Client.getAccessToken()

                const token = jwt.sign({ _id: user._id }, JWT_RESET_KEY, { expiresIn: '30m' });
                
                const CLIENT_URL = 'http://' + req.headers.host;
                const output = `
                <h2>Please click on below link to reset your account password</h2>
                <p>${CLIENT_URL}/users/forget/${token}</p>
                <p><b>NOTE: </b> The activation link expires in 30 minutes.</p>
                `;

                const kt = await userModel.update_resetpw(username,token);
                if (kt)
                {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                type: "OAuth2",
                                user: "nodejsa@gmail.com",
                                clientId: "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com",
                                clientSecret: "OKXIYR14wBB_zumf30EC__iJ",
                                refreshToken: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w",
                                accessToken: accessToken
                            },
                        });

                        // send mail with defined transport object
                        const mailOptions = {
                            from: '"Auth Admin" <nodejsa@gmail.com>', // sender address
                            to: email, // list of receivers
                            subject: "Account Password Reset: NodeJS Auth ✔", // Subject line
                            html: output, // html body
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log(error);
                                req.flash(
                                    'error_msg',
                                    'Something went wrong on our end. Please try again later.'
                                );
                                res.redirect('/users/forget');
                            }
                            else {
                                console.log('Mail sent : %s', info.response);
                                req.flash(
                                    'success_msg',
                                    'Password reset link sent to email ID. Please follow the instructions.'
                                );
                                res.redirect('/users/login');
                            }
                        })
                    }
                }

            }
     
    // await transport.sendMail(resetEmail);
    // req.flash('info', `An e-mail has been sent to ${user.email} with further instructions.`);
    // res.redirect('../forgot');
};


exports.reset = async(req, res, next)=> {
    const {newPassword, renewPassword} = req.body;
    
    try
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

        await userModel.change_password_byID(req.params.id, newPassword);
        res.render('users/reset', {title: 'Đổi mật khẩu', messageSuccess: "Đổi mật khẩu thành công!"});
    }
    catch (err)
    {
        res.render('users/reset',{ title: 'Đổi mật khẩu', message: err}); 
    }
   
};

exports.reset_pw = async(req, res, next)=>{
    const token  = req.params.token;

    if (token) {
        jwt.verify(token, JWT_RESET_KEY, async (err, decodedToken) => {
            if (err) {
                req.flash(
                    'error_msg',
                    'Incorrect or expired link! Please try again.'
                );
                console.log("hello");
                res.redirect('/users/login');
            }
            else {
                const id = decodedToken._id;
                
                const kt = await userModel.getUser(id);
                if (!kt) 
                    {
                        req.flash(
                            'error_msg',
                            'User with email ID does not exist! Please try again.'
                        );
                        res.redirect('/users/login');
                    }
                    else {
                        res.redirect('/users/reset/' + id);
                    }
                }})
            
        }
 
    else {
        console.log("Password reset error!")
    }
};