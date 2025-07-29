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

    Product.findAll(
    {
        where: { categoryId: categoryId },
        attributes: ['id', 'name', 'price', 'image' ]
    })
        .then(products => {
            Category.findAll()
                .then(categories => {
                    res.render('shop/products', {
                        title: 'Products',
                        products: products,
                        categories: categories,
                        selectedCategoryId: categoryId,
                        path: '/products'
                    });
                }).catch(err => {
                    console.log(err);
                });
        }).catch(err => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        title: 'Your Cart',
        path: '/cart'
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        title: 'Your Orders',   
        path: '/orders'
    });
};
