const Product = require('../models/product');
const Category = require('../models/category');

exports.getIndex = (req, res, next) => {

    const products = Product.getAllProducts();
    const categories = Category.getAllCategories();

    res.render('shop/index', {
        title: 'Shopping',
        products: products,
        categories: categories,
        path: '/'
    });
};

exports.getProducts = (req, res, next) => {

    const products = Product.getAllProducts();
    const categories = Category.getAllCategories();

    res.render('shop/products', {
        title: 'Products',
        products: products,
        categories: categories,
        path: '/products'
    });
};

exports.getProduct = (req, res, next) => {

    const product = Product.getById(req.params.productId);

    res.render('shop/product-details', { title: product.title,
        product: product,
        path: '/products'
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
