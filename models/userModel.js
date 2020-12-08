const { ObjectId} = require('mongodb');

const userCollection = require('./MongooseModel/userMongooseModel');

exports.menu = async (id) => {
    //console.log('model db');
    //const booksCollection = db().collection('Books');
    const user = await userCollection.findOne({_id: ObjectId(id)});
    return user;
}

exports.update_profile = async (req,id) => {
    const txtFirstName = req.txtFirstName;
    const txtLastName = req.txtLastName;
    const txtEmail = req.txtEmail;
    const txtProfilePic = req.txtProfilePic;
    const txtAddress = req.txtAddress;
    const txtPhone = req.txtPhone;

    await userCollection.update(
        {_id: ObjectId(id)},
        {
            firstName: txtFirstName,
            lastName : txtLastName,
            email : txtEmail,
            profilePic : txtProfilePic,
            address : txtAddress,
            phone : txtPhone,
        }
    )
}