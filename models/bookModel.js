const { ObjectId} = require('mongodb');
const booksCollection = require('./MongooseModel/bookMongooseModel');
const categoryCollection = require ('./MongooseModel/categoryMongooseModel');

exports.listcategory = async () => {
    //console.log('model db');
    //const booksCollection = db().collection('Books');
    const cat = await categoryCollection.find({});
    return cat;
}

exports.getlistcatID = async (listcategory) =>{
    var res = [];
    await listcategory.forEach(element => {
        res.push(element._id);
        console.log(element._id.toString());
        console.log(res);
    });
    return res;
}
exports.get_name_cat = async (id) => {
    const nameCat = await categoryCollection.findOne({_id: ObjectId(id)});
    return nameCat.catogory;
}

exports.list = async () => {
    console.log('model db');
    //const booksCollection = db().collection('Books');
    const books = await booksCollection.find({isDeleted: false});
    //console.dir(books);
    return books;
}
exports.listStatus = async (status) => {
    const books = await booksCollection.find({status: status});
    return books;
}


exports.listbook = async (filter, pageNumber, itemPerPage, sort ) => {
    
    const sortOrderArr = [1,-1,1,-1];
    let books;

    if (sort ===0 || sort===1)
    {
        books = await booksCollection.paginate(filter, {
            page: pageNumber,
            limit: itemPerPage,
            sort: {basePrice: sortOrderArr[sort]}
        });
    }
    else 
    {
        books = await booksCollection.paginate(filter, {
            page: pageNumber,
            limit: itemPerPage,
            sort: {unsigned_title: sortOrderArr[sort]}
        });
    }
   
    return books;
}

exports.get = async (id) => {
    //const booksCollection = db().collection('Books');
    const book = await booksCollection.findOne({_id: ObjectId(id)})
    return book;
}

exports.getRelatedBooks = async (catID, bookID) => {
    //const booksCollection = db().collection('Books');
    const listRelatedBooks = await booksCollection.find({catID: ObjectId(catID), _id: {$ne:  ObjectId(bookID)}});
    if (listRelatedBooks.length>=1)
    {
        return listRelatedBooks;
    }
        
    else    
        return false;
}

exports.add_comment = async (id, cmt) => {

    await booksCollection.updateOne(   
        {_id: ObjectId(id)},
        {comment: cmt}
    )
}

exports.listcomment = async (bookID, page, perPage) => {

    const arr_comment = await booksCollection.findOne({ _id: ObjectId(bookID) }).select("comment");
    const comment = arr_comment.comment.slice(perPage * (page-1), perPage*page);
    return comment;
}
