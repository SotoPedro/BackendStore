const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/category.controller');

categoryRouter.get('/',categoryController.getAll)
categoryRouter.get('/:id',categoryController.getOne);
categoryRouter.post('/',categoryController.addCategory);
categoryRouter.delete('/:id',categoryController.deleteCategory);
categoryRouter.put('/:id',categoryController.updateCategory);

module.exports  = categoryRouter;