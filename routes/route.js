const route = require('express').Router();
const { getAllProducts, searchProduct,deals, addToCart, getCartItems, removeFromCart} = require('../controllers/controller')

route.get('/get-all', getAllProducts);
route.get('/products/:product', searchProduct);
route.get('/deals',deals);
route.post('/add-cart',addToCart);
route.get('/cart-item',getCartItems);
route.post('/delete-cart',removeFromCart);

module.exports = route;