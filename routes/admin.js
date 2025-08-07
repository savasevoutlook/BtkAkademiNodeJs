const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');


router.get('/products', adminController.getProducts);

router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);


router.get('/categories', adminController.getCategories);

router.get('/add-category', adminController.getAddCategory);

router.post('/add-category', adminController.postAddCategory);

router.get('/edit-category/:categoryId', adminController.getEditCategory);

router.post('/edit-category', adminController.postEditCategory);


module.exports = router;
