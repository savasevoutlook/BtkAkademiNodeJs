const Product = require('../models/product');
const Category = require('../models/category');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {

    //console.log(req.session.isAuthenticated);

    Product.find()
        .then(products => {
            return products;
        })
        .then(products => {
            Category.find()
                .then(categories => {
                    res.render('shop/index', {
                        title: 'Shopping',
                        products: products,
                        categories: categories,
                        path: '/'
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            return products;
        })
        .then(products => {
            Category.find()
                .then(categories => {
                    res.render('shop/products', {
                        title: 'Products',
                        products: products,
                        categories: categories,
                        path: '/products'
                    }); 
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProduct = (req, res, next) => {
    Product.findById(req.params.productId)
        .then(product => {
            res.render('shop/product-details', {
                title: product.name,
                product: product,
                path: '/products'
            });
        }).catch(err => {
            console.log(err);
        });
};

exports.getProductsByCategory = (req, res, next) => {
    const categoryId = req.params.categoryId;
    const model = [];

    Category.find()
        .then(categories => {
            model.categories = categories;

            return Product.find({
                categories: categoryId
            });
        })
        .then(products => {
            res.render('shop/products', {
                title: 'Products',
                products: products,
                categories: model.categories,
                selectedCategoryId: categoryId,
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {            
            res.render('shop/cart', {
                title: 'Cart',
                path: '/cart',
                products: user.cart.items
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;

    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postCartItemDelete = (req, res, next) => {
    const productId = req.body.productId;

    req.user.deleteCartItem(productId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getOrders = (req, res, next) => {

    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                title: 'Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const order = new Order({
                user: {
                    userId: req.user._id,
                    username: req.user.username,
                    email: req.user.email
                },
                items: user.cart.items.map(item => {
                    return {
                        product: {
                            _id: item.productId._id,
                            name: item.productId.name,
                            price: item.productId.price,
                            image: item.productId.image,
                        },
                        quantity: item.quantity
                    };
                })
            });

            return order.save();
        })
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        });
};
