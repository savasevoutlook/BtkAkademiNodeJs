const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middleware/authentication');
const { doubleCsrfProtection } = require('../utility/csrf');

const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/categories/:categoryId', shopController.getProductsByCategory);

router.get('/cart', isAuthenticated, shopController.getCart);

router.get('/orders', isAuthenticated, shopController.getOrders);


router.post('/cart', isAuthenticated, doubleCsrfProtection, shopController.postCart);

router.post('/delete-cartitem', isAuthenticated, doubleCsrfProtection, shopController.postCartItemDelete);

router.post('/create-order', isAuthenticated, doubleCsrfProtection, shopController.postOrder);


module.exports = router;
