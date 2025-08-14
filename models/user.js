const getDb = require('../utility/database').getDb;
const { ObjectId } = require('mongodb');

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart ? cart : {};
        this.cart.items = cart ? cart.items : [];
        this._id = id ? new ObjectId(id) : null;
    }

    save() {
        const db = getDb();
        return db.collection('users')
            .insertOne(this);
    }

    getCart() {
        
    }

    addToCart(product) {
        const index = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString()
        });

        const cartItems = [...this.cart.items];

        let itemQuantity = 1;

        if (index >= 0) {
            itemQuantity = cartItems[index].quantity + 1;
            cartItems[index].quantity = itemQuantity;
        } else {
            cartItems.push({
                productId: new ObjectId(product._id),
                quantity: itemQuantity
            });
        }

        const db = getDb();
        return db.collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) },
                {
                    $set: {
                        cart: {
                            items: cartItems
                        }
                    }
                }
            );
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
