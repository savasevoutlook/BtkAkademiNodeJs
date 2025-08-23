const express = require('express');
const router = express.Router();

const { doubleCsrfProtection } = require('../utility/csrf');
const adminController = require('../controllers/admin');


router.get('/products',  adminController.getProducts);

router.get('/add-product', adminController.getAddProduct);

router.get('/categories', adminController.getCategories);

router.get('/add-category', adminController.getAddCategory);

router.get('/edit-category/:categoryId', adminController.getEditCategory);

router.get('/edit-product/:productId', adminController.getEditProduct);


router.post('/add-product', doubleCsrfProtection, adminController.postAddProduct);

router.post('/edit-product', doubleCsrfProtection, adminController.postEditProduct);

router.post('/delete-product', doubleCsrfProtection, adminController.postDeleteProduct);

router.post('/add-category', doubleCsrfProtection, adminController.postAddCategory);

router.post('/edit-category', doubleCsrfProtection, adminController.postEditCategory);

router.post('/delete-category', doubleCsrfProtection, adminController.postDeleteCategory);


module.exports = router;
