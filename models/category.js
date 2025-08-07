const getDb = require('../utility/database').getDb;
const { ObjectId } = require('mongodb');

class Category {
    constructor(name, description, id) {
        this.name = name;
        this.description = description;
        this._id = id ? new ObjectId(id) : null;
    }

    static findAll() {
        const db = getDb();

        return db.collection('categories')
            .find({})
            .toArray()
            .then(categories => {
                return categories;
            })
            .catch(err => console.log(err));
    }

    static findById(categoryId) {
        if (!ObjectId.isValid(categoryId)) {
            return Promise.reject(new Error('Invalid ObjectId'));
        }

        const db = getDb();

        return db.collection('categories')
            .findOne({ _id: new ObjectId(categoryId) })
            .then(category => {
                return category;
            })
            .catch(err => {
                console.log(err);
            });
    }

    save() {
        let db = getDb();

        if (this._id) {
            db = db.collection('categories').updateOne({ _id: this._id }, { $set: this });
        } else {
            db =  db.collection('categories').insertOne(this);
        }

        return db
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }

    static deleteById(categoryId) {
        const db = getDb();

        return db.collection('categories')
            .deleteOne({ _id: new ObjectId(categoryId) })
            .then(() => {
                console.log('deleted');
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = Category;
