const Product = require("../models/product");
//const Category = require("../models/category");

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render("admin/products", {
                title: "Admin Products",
                products: products,
                path: "/admin/products",
                action: req.query.action,
            });
        }).catch(err => {
            console.log(err);
        });
};

exports.getAddProduct = (req, res, next) => {

    res.render("admin/add-product", {
        title: "New Product",
        //categories: categories,
        path: "/admin/add-product",
    });
};

exports.postAddProduct = (req, res, next) => {

    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const description = req.body.description;

    const product = new Product(name, price, description, image);

    product.save()
        .then(result => {
            res.redirect("/admin/products");
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    
    Product.findById(req.params.productId)
        .then(product => {
            if (!product) {
                return res.redirect('/admin/products');
            }

            res.render("admin/edit-product", {
                title: "Edit Product",
                product: product,
                //categories: categories,
                path: "/admin/edit-product",
            });
        }).catch(err => {
            console.log(err);
        });
};

exports.postEditProduct = (req, res, next) => {
    Product.findByPk(req.body.id)
        .then((product) => {
            product.name = req.body.name;
            product.price = req.body.price;
            product.image = req.body.image;
            product.description = req.body.description;
            product.categoryId = req.body.categoryId;
            
            return product.save();
        })
        .then(() => {
            res.redirect("/admin/products?action=edit");
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postDeleteProduct = (req, res, next) => {

    Product.destroy({ where: { id: req.body.productId } })
        .then(() => {
            res.redirect("/admin/products?action=delete");
        })
        .catch(err => {
            console.log(err);
        });
};
