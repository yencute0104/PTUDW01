const { MongoClient } = require("mongodb");

const uri =
    "mongodb+srv://nganyen:123@cluster0.qwbft.mongodb.net/test?authSource=admin&replicaSet=atlas-itiptg-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
// Create a new MongoClient
const client = new MongoClient(uri, { useUnifiedTopology: true });

let database;

async function connectDb(){
    await client.connect();
    // Establish and verify connection
    database = await client.db("PTUDW_BookStore");
    console.log('Db connected!');
}

console.log('RUNNING DB...');

connectDb();

const db = () => database;

module.exports.db = db;

//const filter = {};

// MongoClient.connect(
//   'mongodb+srv://nganyen:123@cluster0.qwbft.mongodb.net/test?authSource=admin&replicaSet=atlas-itiptg-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   function(connectErr, client) {
//     assert.equal(null, connectErr);
//     const coll = client.db('PTUDW_BookStore').collection('Books');
//     coll.find(filter, (cmdErr, result) => {
//       assert.equal(null, cmdErr);
//     });
//     client.close();
//   });