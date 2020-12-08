const userModel = require('../models/userModel');
const fs = require('fs');
const formidable = require('formidable');
const ISLOGIN = true;
const ID = "5fce291f0c30b818400d4ce1";

exports.index = async(req, res, next) => {
    // Get books from model
    //const books = bookModel.list();
    // Pass data to view to display list of books
    var user;
    if (ISLOGIN)
        user = await userModel.menu(ID);

    res.render('users/login');
};

exports.profile = async(req, res, next) => {
    // Get books from model
    //const books = bookModel.list();
    // Pass data to view to display list of books
    var user;
    if (ISLOGIN)
        res.render('users/profile',await userModel.menu(ID));
};

exports.update_profile = async(req, res, next) => {
    
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
          next(err);
          return;
        }
        const coverImage = files.txtProfilePic;
        if (coverImage && coverImage.size > 0) {
            const filename = coverImage.path.split('\\').pop() + '.' + coverImage.name.split('.').pop();
            fs.renameSync(coverImage.path, process.env.USER_IMAGE_FOLDER + '\\' + filename);
            fields.txtProfilePic =  '\\images\\users\\' + filename;
        }
         // Update books from model
        userModel.update_profile(fields,ID).then(()=>{
        res.redirect('../../');
        });
        
      });
};

// exports.logout = async (req, res, next) => {
//     // Get books from model
//     //const books = bookModel.list();
//     // Pass data to view to display list of books
//     await res.render('account');
// };

// exports.register = async (req, res, next) => {
//     // Get books from model
//     //const books = bookModel.list();
//     // Pass data to view to display list of books
//     await res.render('account');
// };