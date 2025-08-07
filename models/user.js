const getDb = require('../utility/database').getDb;
const { ObjectId } = require('mongodb');

class User {
    constructor(name, email, id) {
        this.name = name;
        this.email = email;
        this._id = id ? new ObjectId(id) : null;
    }

    save() {
        const db = getDb();
        return db.collection('users')
            .insertOne(this);
    }

    static findById(userId) {
        const db = getDb();

        return db.collection('users')
            .findOne({ _id: new ObjectId(userId) })
            .then(user => {
                return user;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findByEmail(email) {
        const db = getDb();

        return db.collection('users')
            .findOne({ email: email })
            .then(user => {
                return user;
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = User;
