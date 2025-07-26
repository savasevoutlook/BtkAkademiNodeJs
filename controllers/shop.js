const Product = require('../models/product');
const Category = require('../models/category');

exports.getIndex = (req, res, next) => {

    const categories = Category.getAllCategories();

    Product.getAllProducts().then(products => {
        
        res.render('shop/index', {
            title: 'Shopping',
            products: products[0],
            categories: categories,
            path: '/'
        });

    }).catch(err => {
        console.log(err);
    });
};

exports.getProducts = (req, res, next) => {

    const categories = Category.getAllCategories();

    Product.getAllProducts().then(products => {
        
        res.render('shop/products', {
            title: 'Products',
            products: products[0],
            categories: categories,
            path: '/products'
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
    const products = Product.getProductsByCategoryId(categoryId);
    const categories = Category.getAllCategories();

    res.render('shop/products', {
        title: 'Products',
        products: products,
        categories: categories,
        selectedCategoryId: categoryId,
        path: '/products'
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
