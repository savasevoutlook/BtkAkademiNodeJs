const Product = require("../models/product");
const Category = require("../models/category");


exports.getProducts = (req, res, next) => {
    Product.find()
        //.limit(10)
        .sort({ name: 1})
        .select({ description: 0 }) 
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
        path: "/admin/add-product",
    });
};

exports.postAddProduct = (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const description = req.body.description;
    // const userId = req.user._id;
    // const categories = req.body.categoryIds;

    const product = new Product({
        name: name,
        price: price,
        description: description,
        image: image,
    });

    product.save()
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    
    Product.findOne({ _id: req.params.productId })
        .then(product => {
            if (!product) {
                return res.redirect('/admin/products');
            }

            Category.find()
                .then(categories => {
                    categories = categories.map(category => {
                        if (product.categories) {
                            product.categories.find(item => {
                                if (item == category._id) {
                                    category.selected = true;
                                }
                            });
                        }
                        return category;
                    });                    

                    res.render("admin/edit-product", {
                        title: "Edit Product",
                        product: product,
                        categories: categories,
                        path: "/admin/edit-product",
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }).catch(err => {
            console.log(err);
        });
};

exports.postEditProduct = (req, res, next) => {

    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const description = req.body.description;

    Product.updateOne({ _id: id },
        {
            $set: {
                name: name,
                price: price,
                image: image,
                description: description,
            }
        })
        .then(() => {
            res.redirect("/admin/products?action=edit");
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postDeleteProduct = (req, res, next) => {

    Product.deleteById(req.body.productId)
        .then(() => {
            res.redirect("/admin/products?action=delete");
        })
        .catch(err => {
            console.log(err);
        });
};


exports.getCategories = (req, res, next) => {
    Category.find()
        .then(categories => {
            res.render("admin/categories", {
                title: "Admin Categories",
                categories: categories,
                path: "/admin/categories",
                action: req.query.action,
            });
        }).catch(err => {
            console.log(err);
        });
};

exports.getAddCategory = (req, res, next) => {
    res.render("admin/add-category", {
        title: "New Category",
        path: "/admin/add-category",
    });
};

exports.postAddCategory = (req, res, next) => {

    const name = req.body.name;
    const description = req.body.description;

    const category = new Category(name, description);

    category.save()
        .then(() => {
            res.redirect("/admin/categories");
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditCategory = (req, res, next) => {
    
    Category.findOne({ _id: req.params.categoryId })
        .then(category => {
            if (!category) {
                return res.redirect('/admin/categories');
            }

            res.render("admin/edit-category", {
                title: "Edit Category",
                category: category,
                path: "/admin/edit-category",
            });
        }).catch(err => {
            console.log(err);
        });
};

exports.postEditCategory = (req, res, next) => {
    
    const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;

    const category = new Category(name, description, id);

    category.save()
        .then(() => {
            res.redirect("/admin/categories?action=edit");
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postDeleteCategory = (req, res, next) => {

    Category.deleteById(req.body.categoryId)
        .then(() => {
            res.redirect("/admin/categories?action=delete");
        })
        .catch(err => {
            console.log(err);
        });
};
