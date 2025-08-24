const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middleware/authentication');
const csrfTokenMiddleware = require('../middleware/csrfTokenMiddleware');
const { doubleCsrfProtection } = require('../utility/csrf');

const shopController = require('../controllers/shop');

router.get('/', csrfTokenMiddleware, shopController.getIndex);

router.get('/products', csrfTokenMiddleware, shopController.getProducts);

router.get('/products/:productId', csrfTokenMiddleware, shopController.getProduct);

router.get('/categories/:categoryId', csrfTokenMiddleware, shopController.getProductsByCategory);

router.get('/cart', csrfTokenMiddleware, isAuthenticated, shopController.getCart);

router.get('/orders', isAuthenticated, csrfTokenMiddleware, shopController.getOrders);


router.post('/cart', isAuthenticated, doubleCsrfProtection, shopController.postCart);

router.post('/delete-cartitem', isAuthenticated, doubleCsrfProtection, shopController.postCartItemDelete);

router.post('/create-order', isAuthenticated, doubleCsrfProtection, shopController.postOrder);


module.exports = router;
