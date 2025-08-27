const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ürün adı zorunludur'],
        minlength: [5, 'Ürün adı en az 5 karakter olmalıdır'],
        maxlength: [255, 'Ürün adı en fazla 255 karakter olmalıdır'],
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        required: function() {
            return this.isActive;
        },
        get: value => Math.round(value),
        set: value => Math.round(value)
    },
    description: {
        type: String,
        trim: true   
    },
    imageUrls: [
        {
            type: String
        }
    ],
    date: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }
    ],
    // tags: {
    //     type: Array,
    //     validate: {
    //         validator: function(value) {
    //             return value && value.length > 0;
    //         },
    //         message: 'Ürün için en az bir etiket giriniz'
    //     }
    // },
    isActive: {
        type: Boolean
    }
});

module.exports = mongoose.model('Product', productSchema); //products
