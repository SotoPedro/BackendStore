const express = require('express');
const userRouter = express.Router();

const userController = require('../controllers/user.controller');

userRouter.get('/', userController.getAll);
userRouter.get('/:id',userController.getOne);
userRouter.get('/get/count',userController.getCount);
userRouter.post('/',userController.createUser);
userRouter.post('/signUp',userController.signUp);
userRouter.post('/signIn',userController.signIn);
userRouter.put('/:id',userController.updateUser);
userRouter.delete('/:id',userController.deleteUser);

module.exports  = userRouter;