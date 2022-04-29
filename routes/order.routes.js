const express = require('express');
const orderRouter = express.Router();

const orderController = require('../controllers/order.controller');

orderRouter.get('/', orderController.getAll);
orderRouter.get('/:id', orderController.getOne);
orderRouter.get('/get/totalSales', orderController.getTotal);
orderRouter.get('/get/count', orderController.getcount);
orderRouter.get('/get/userOrders/:userId', orderController.getUserOrder);

orderRouter.post('/',orderController.createOrder);
orderRouter.put('/:id',orderController.updateOrder);
orderRouter.delete('/:id',orderController.deleteOrder);

module.exports  = orderRouter;