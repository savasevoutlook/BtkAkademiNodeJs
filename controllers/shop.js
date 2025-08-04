const Product = require('../models/product');
const Category = require('../models/category');

exports.getIndex = (req, res, next) => {
    Product.findAll({ attributes: ['id', 'name', 'price', 'image' ] })
        .then(products => {
            Category.findAll()
                .then(categories => {
                    res.render('shop/index', {
                        title: 'Shopping',
                        products: products,
                        categories: categories,
                        path: '/'
                    }); 
                }).catch(err => {
                    console.log(err);
                });
        }).catch(err => {
            console.log(err);
        });
};

exports.getProducts = (req, res, next) => {
    Product.findAll({ attributes: ['id', 'name', 'price', 'image' ] })
        .then(products => {
            Category.findAll()
                .then(categories => {
                    res.render('shop/products', {
                        title: 'Products',
                        products: products,
                        categories: categories,
                        path: '/products'
                    }); 
                }).catch(err => {
                    console.log(err);
                });
        }).catch(err => {
            console.log(err);
        });
};

exports.getProduct = (req, res, next) => {
    Product.findByPk(req.params.productId)
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

    Category.findAll()
        .then(categories => {
            const category = categories.find(x => x.id == categoryId);
            return category.getProducts().then(products => {
                return { products, categories };
            });
        })
        .then(({ products, categories }) => {
            res.render('shop/products', {
                title: 'Products',
                products: products,
                categories: categories,
                selectedCategoryId: categoryId,
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        title: 'Cart',
                        path: '/cart',
                        products: products
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

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    let quantity = 1;
    let currentCart;

    req.user.getCart()
        .then(cart => {
            if (!cart) {
                return req.user.createCart();
            }

            return cart;
        })
        .then(cart => {
            currentCart = cart;
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            let product;

            if (products.length > 0) {
                product = products[0];
            }

            if (product) {
                quantity += product.cartItem.quantity;
                return product;
            }

            return Product.findByPk(productId);
        })
        .then(product => {
            if (!product) {
                throw new Error('Product not found');
            }

            return currentCart.addProduct(product, {
                through: {
                    quantity: quantity
                }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/');
        });
};

exports.postCartItemDelete = (req, res, next) => {
    const productId = req.body.productId;

    req.user.getCart()
        .then(cart => {
            if (!cart) {
                res.redirect('/cart');
            }

            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders({ include: ['products'] })
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
    let userCart;

    req.user.getCart()
        .then(cart => {
            if (!cart) {
                return res.redirect('/cart');
            }

            userCart = cart;
            return cart.getProducts()
        })
        .then(products => {
            if (products.length === 0) {
                return res.redirect('/cart');
            }

            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = {
                            quantity: product.cartItem.quantity,
                            price: product.price
                        };

                        return product;
                    }));
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .then(() => {
            return userCart.setProducts(null);
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => { console.log(err) });
};
