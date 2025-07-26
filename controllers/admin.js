const Product = require("../models/product");
const Category = require("../models/category");

exports.getProducts = (req, res, next) => {
    
    Product.getAllProducts().then(products => {
        
        res.render("admin/products", {
            title: "Admin Products",
            products: products[0],
            path: "/admin/products",
            action: req.query.action,
        });
        
    }).catch(err => {
        console.log(err);
    });
};

exports.getAddProduct = (req, res, next) => {

    var categories = Category.getAllCategories();

    res.render("admin/add-product", {
        title: "New Product",
        categories: categories,
        path: "/admin/add-product",
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(
        req.body.name,
        req.body.price,
        req.body.image,
        req.body.description,
        req.body.categoryId,
    );

    product.saveProduct();

    res.redirect("/admin/products");
};

exports.getEditProduct = (req, res, next) => {
    
    var categories = Category.getAllCategories();

    Product.getProductById(req.params.productId)
        .then(product => {

            res.render("admin/edit-product", {
                title: "Edit Product",
                product: product[0][0],
                categories: categories,
                path: "/admin/edit-product",
            });

        }).catch(err => {
            console.log(err);
        });
};

exports.postEditProduct = (req, res, next) => {
    const product = Product.getProductById(req.body.id);

    product.name = req.body.name;
    product.price = req.body.price;
    product.image = req.body.image;
    product.description = req.body.description;
    product.categoryId = req.body.categoryId;

    Product.updateProduct(product);

    res.redirect("/admin/products?action=edit&id=" + product.id);
};

exports.postDeleteProduct = (req, res, next) => {

    Product.deleteById(req.body.productId);

    res.redirect("/admin/products?action=delete");
};
