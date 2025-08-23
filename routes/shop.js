const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middleware/authentication');

const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/categories/:categoryId', shopController.getProductsByCategory);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/delete-cartitem', shopController.postCartItemDelete);

router.get('/orders', isAuthenticated, shopController.getOrders);

router.post('/create-order', isAuthenticated, shopController.postOrder);

module.exports = router;
