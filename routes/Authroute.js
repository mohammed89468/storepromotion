const authController = require('../Controllers/AuthController');
const express = require('express');
const AuthMiddleware = require('../Middleware/AuthMiddleware');
const route = express.Router();

route.get('/updateuser/:id',AuthMiddleware,authController.deleteUser);
route.get('/updateuserdata/:id',AuthMiddleware,authController.deleteUser);
route.post('/newuser',authController.addUser);
route.delete('/deleteuser',AuthMiddleware,authController.deleteUser);
route.put('/updateuser/:id',AuthMiddleware,authController.deleteUser);
route.patch('/updateuserdata/:id',AuthMiddleware,authController.deleteUser);
route.post('/userLogin',authController.userLogin);
route.post('/sendotp',authController.sendotp);
route.get('/fetchuser',AuthMiddleware,authController.getUsers);
route.post('/verifyotp',authController.verifyotp);


module.exports = route; 