const getDb = require('../utility/database').getDb;
const { ObjectId } = require('mongodb');

class Product {
    constructor(name, price, description, image) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.image = image;
    }

    static findAll() {
        const db = getDb();

        return db.collection('products')
            .find({})
            .toArray()
            .then(products => {
                return products;
            })
            .catch(err => console.log(err));
    }

    static findById(productId) {
        if (!ObjectId.isValid(productId)) {
            return Promise.reject(new Error('Invalid ObjectId'));
        }

        const db = getDb();

        return db.collection('products')
            .findOne({ _id: new ObjectId(productId) })
            .then(product => {
                return product;
            })
            .catch(err => {
                console.log(err);
            });
    }

    save() {
        const db = getDb();

        db.collection('products')
            .insertOne(this)
            .then(result => {
                //console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = Product;
