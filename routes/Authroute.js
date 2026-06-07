const authController = require('../Controllers/AuthController');
const express = require('express');
const route = express.Router();

route.get('/updateuser/:id',authController.deleteUser);
route.get('/updateuserdata/:id',authController.deleteUser);
route.post('/newuser',authController.addUser);
route.delete('/deleteuser',authController.deleteUser);
route.put('/updateuser/:id',authController.deleteUser);
route.patch('/updateuserdata/:id',authController.deleteUser);
route.post('/userLogin',authController.userLogin);
route.post('/sendotp',authController.sendotp);
route.get('/fetchuser',authController.getUsers);
route.post('/verifyotp',authController.verifyotp);


module.exports = route; 