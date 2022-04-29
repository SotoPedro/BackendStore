const express = require('express');
const productRouter = express.Router();
const productController = require('../controllers/products.controller');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',    
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];        
        let uploadError = new Error('invalid image type');

        if(isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
        
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.replace(' ', '-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null,`${fileName}-${Date.now()}.${extension}`);
    }
})

const uploadOptions = multer({storage: storage});
//Request
productRouter.get('/', productController.getAll);
productRouter.get('/:id',productController.getOne);
productRouter.get('/get/count',productController.getCount);
productRouter.get('/get/featured/:count',productController.getFeatured);

productRouter.post('/', uploadOptions.single('image'), productController.AddProduct);
productRouter.delete('/:id',productController.DeleteProduct);
productRouter.put('/:id',productController.updateProduct);
productRouter.put('/gallery-images/:id',uploadOptions.array('images',10), productController.updateGallery)

module.exports = productRouter