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

    Category.getAllCategories().then(categories => {
        res.render("admin/add-product", {
            title: "New Product",
            categories: categories[0],
            path: "/admin/add-product",
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.postAddProduct = (req, res, next) => {

    // Product.create({
    //     name: req.body.name,
    //     price: req.body.price,
    //     image: req.body.image,
    //     description: req.body.description,
    //     categoryId: req.body.categoryId
    // }).then(() => {
    //     res.redirect("/admin/products");
    // }).catch(err => {
    //     console.log(err);
    // });

    const product = Product.build({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description,
        categoryId: req.body.categoryId
    });

    product.save()
        .then(result => {
            res.redirect("/admin/products");
        })
        .catch(err => {
            console.timeLog(err);
        });
};

exports.getEditProduct = (req, res, next) => {

    Product.getProductById(req.params.productId)
        .then(product => {
            
            Category.getAllCategories().then(categories => {
            
                res.render("admin/edit-product", {
                    title: "Edit Product",
                    product: product[0][0],
                    categories: categories[0],
                    path: "/admin/edit-product",
                });
                
            }).catch(err => {
                console.log(err);
            });

        }).catch(err => {
            console.log(err);
        });
};

exports.postEditProduct = (req, res, next) => {
    const product = new Product();

    product.id = req.body.id;
    product.name = req.body.name;
    product.price = req.body.price;
    product.image = req.body.image;
    product.description = req.body.description;
    product.categoryId = req.body.categoryId;

    Product.updateProduct(product).then(() => {
        res.redirect("/admin/products?action=edit");
    }).catch(err => {
        console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {

    Product.deleteProductById(req.body.productId)
        .then(() => {
            res.redirect("/admin/products?action=delete");
        })
        .catch(err => {
            console.log(err);
        });
};
