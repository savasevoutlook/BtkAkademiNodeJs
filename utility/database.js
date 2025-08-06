const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb://localhost:27017/node-app')
        .then(client => {
            console.log('connected');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

const getDb = () => {
    if (!_db)
        throw 'No Database';

    return _db;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
