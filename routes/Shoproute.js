const shopController = require('../Controllers/ShopController');
const express = require('express');
const AuthMiddleware = require('../Middleware/AuthMiddleware');
const route = express.Router();


route.put('/updateshopdata/:id',AuthMiddleware,shopController.updateShop); 
route.post('/newshop',AuthMiddleware,shopController.addShop);
route.delete('/deleteShop',AuthMiddleware,shopController.deleteShop);
route.patch('/updateShop/:id',AuthMiddleware,shopController.shopChanges);
route.get('/shopdatabyid/:id',AuthMiddleware,shopController.getshopbyid);
route.post('/shopLogin',shopController.shopLogin);
route.post('/sendotp',shopController.sendotp);
route.get('/fetchshops',AuthMiddleware,shopController.getShops);
route.post('/verifyotp',shopController.verifyotp);

module.exports = route; 