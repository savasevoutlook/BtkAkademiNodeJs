const mongoose = require('mongoose');
const Product = require('./product');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,        
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    cart: {
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                }
            }
        ]
    }
});

userSchema.methods.getCart = function() {
    const productIds = this.cart.items.map(item => {
        return item.productId;
    });

    return Product.find({ _id: { $in: productIds } })
        .select('name price image')
        .then(products => {
            return products.map(product => {
                return {
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: this.cart.items.find(item => {
                        return item.productId.toString() === product._id.toString();
                    }).quantity
                };
            });
        });
}

userSchema.methods.addToCart = function(product) {
    const index = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });

    const updatedCartItems = [...this.cart.items];

    let itemQuantity = 1;
    if (index >= 0) {
        itemQuantity = this.cart.items[index].quantity + 1;
        updatedCartItems[index].quantity = itemQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: itemQuantity
        });
    }

    this.cart = { items: updatedCartItems };

    return this.save();
}

userSchema.methods.deleteCartItem = function(productId) {
    const cartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });

    this.cart.items = cartItems;

    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('User', userSchema); //users
