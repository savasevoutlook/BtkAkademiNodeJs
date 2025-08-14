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
        const ids = this.cart.items.map(i => {
            return i.productId;
        });

        const db = getDb();

        return db.collection('products')
            .find({
                _id: {
                    $in: ids
                }
            })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString()
                        }).quantity
                    };
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    addToCart(product) {
        const index = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString()
        });

        const updatedCartItems = [...this.cart.items];

        let itemQuantity = 1;

        if (index >= 0) {
            itemQuantity = this.cart.items[index].quantity + 1;
            updatedCartItems[index].quantity = itemQuantity;
        } else {
            updatedCartItems.push({
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
                            items: updatedCartItems
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

    deleteCartItem(productId) {
        const cartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString()
        });

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

    getOrders() {

    }

    addOrder() {
        const db = getDb();

        return this.getCart()
            .then(products => {

                const order = {
                    items: products.map(item => {
                        return {
                            _id: item._id,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            userId: item.userId,
                            quantity: item.quantity
                        };
                    }),
                    user: {
                        _id: new ObjectId(this._id),
                        name: this.name,
                        email: this.email
                    },
                    date: new Date().toLocaleString()
                };

                return db.collection('orders').insertOne(order);
            })
            .then(() => {
                this.cart = { items: [] };
                return db.collection('users')
                    .updateOne(
                        { _id: new ObjectId(this._id) },
                        {
                            $set: {
                                cart: {
                                    items: []
                                }
                            }
                        }
                    );
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = User;
