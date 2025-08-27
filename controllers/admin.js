const Product = require("../models/product");
const Category = require("../models/category");
const fs = require('fs');
const path = require('path');

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        .populate("userId", 'username')
        .select('name price userId imageUrl')
        .sort({ name: 1})
        .then(products => {
            res.render("admin/products", {
                title: "Admin Products",
                products: products,
                path: "/admin/products",
                action: req.query.action,
            });
        }).catch(err => {
            next(err);
        });
};

exports.getAddProduct = (req, res, next) => {
    Category.find()
        .then(categories => {
            res.render("admin/add-product", {
                title: "New Product",
                path: "/admin/add-product",
                categories: categories,
            });
        })
        .catch(err => {
            next(err);
        });
};

exports.postAddProduct = (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const ids = req.body.categoryIds;
    const isActive = req.body.isActive === "on" ? true : false;
    
    const imagePath = req.file ? '/' + req.file.path.replace(/\\/g, "/") : null;

    const product = new Product({
        name: name,
        price: price,
        description: description,
        imageUrl: imagePath,
        userId: req.user._id,
        categories: ids ? ids : [],
        isActive: isActive
    });

    product.save()
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch(err => {
            next(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    
    Product.findOne({ _id: req.params.productId, userId: req.user._id })
        .then(product => {
            if (!product) {
                return res.redirect('/admin/products');
            }

            return product;
        })
        .then(product => {
            Category.find()
                .then(categories => {
                    categories = categories.map(category => {
                        if (product.categories) {
                            product.categories.find(item => {
                                if (item.toString() == category._id.toString()) {
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
                    next(err);
                });
        }).catch(err => {
            next(err);
        });
};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.id;
    const categoryIds = req.body.categoryIds;
    let imageUrl;

    if (req.file) {
        imageUrl = '/' + req.file.path.replace(/\\/g, "/");
    }

    Product.findOne({ _id: id, userId: req.user._id })
        .then(product => {
            if (!product) {
                return res.redirect('/admin/products');
            }

            product.name = req.body.name;
            product.price = req.body.price;
            product.description = req.body.description;
            product.categories = categoryIds ? categoryIds : [];
            product.isActive = req.body.isActive === "on" ? true : false;

            if (imageUrl) {
                if (product.imageUrl) {

                    const fullImagePath = path.join(__dirname, '..', product.imageUrl); 

                    fs.unlink(fullImagePath, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }

                product.imageUrl = imageUrl;
            }

            return product.save();
        })
        .then(() => {
            res.redirect("/admin/products?action=edit");
        })
        .catch(err => {
            next(err);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;

    Product.deleteOne({ _id: id, userId: req.user._id })
        .then(() => {
            res.redirect("/admin/products?action=delete");
        })
        .catch(err => {
            next(err);
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
            next(err);
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

    const category = new Category({
        name: name,
        description: description,
    });

    category.save()
        .then(() => {
            res.redirect("/admin/categories");
        })
        .catch(err => {
            next(err);
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
            next(err);
        });
};

exports.postEditCategory = (req, res, next) => {
    
    const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;

    Category.findById(id)
        .then(category => {
            if (!category) {
                return res.redirect('/admin/categories');
            }

            category.name = name;
            category.description = description;

            return category.save();
        })
        .then(() => {
            res.redirect("/admin/categories?action=edit");
        })
        .catch(err => {
            next(err);
        });
};

exports.postDeleteCategory = (req, res, next) => {

    Category.findByIdAndDelete(req.body.categoryId)
        .then(() => {
            res.redirect("/admin/categories?action=delete");
        })
        .catch(err => {
            next(err);
        });
};
