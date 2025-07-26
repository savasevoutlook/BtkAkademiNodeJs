const Product = require('../models/product');
const Category = require('../models/category');

exports.getIndex = (req, res, next) => {

    Product.getAllProducts().then(products => {
        
        Category.getAllCategories().then(categories => {
        
            res.render('shop/index', {
                title: 'Shopping',
                products: products[0],
                categories: categories[0],
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

    Product.getAllProducts().then(products => {
        
        Category.getAllCategories().then(categories => {
        
            res.render('shop/products', {
                title: 'Products',
                products: products[0],
                categories: categories[0],
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

    Product.getProductById(req.params.productId)
        .then(product => {

            res.render('shop/product-details', {
                title: product[0][0].name,
                product: product[0][0],
                path: '/products'
            });

        }).catch(err => {
            console.log(err);
        });
};

exports.getProductsByCategory = (req, res, next) => {
    
    const categoryId = req.params.categoryId;

    Product.getProductsByCategoryId(categoryId).then(products => {
        
        Category.getAllCategories().then(categories => {
        
            res.render('shop/products', {
                title: 'Products',
                products: products[0],
                categories: categories[0],
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
