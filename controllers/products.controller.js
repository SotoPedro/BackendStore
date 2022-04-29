const productModel = require('../models/product');
const categoryModel = require('../models/category');

const productController = { };



productController.getAll = async (req, res) => {
    try {
        //select is usefull to just show some information: .select('name description -_id')
        let filter = {}
        
        if(req.query.categories) {
            filter = {category: req.query.categories.split(',')}
        }
        
        const products = await productModel.find(filter).populate('category').lean(); //any field connected will be displayed eg: category.                      

        if(!products){
            return res.status(400).send("There are no product list");
        }
        res.status(200).json(products);

    } catch (err) {
        res.status(400).send(err);
    }
}

productController.getCount = async (req, res) => {
    try {
        const productCount = await productModel.countDocuments(count => count);

        if(!productCount) {
            return res.status(500).json({success: false});
        }

        res.status(200).send({
            count: productCount
        });

    } catch(err) {
        res.status(400).json({
            error: err,
            success: false
        });
    }
}

productController.getFeatured = async (req, res) => {
    try {

        const count = req.params.count ? req.params.count : 0; //we check wether there are feature products   

        const products = await productModel.find({isFeatured: true}).limit(+count); //we find only products that are isFeatured

        if(!products) {
            return res.status(500).json({success: false});
        }

        res.status(200).send(products);

    } catch(err) {
        res.status(400).json({
            error: err,
            success: false
        });
    }
}

productController.getOne = async (req, res) => {
    try {

        const { id } = req.params
        const product = await productModel.findById(id).populate('category','name').lean();

        if(!product) {
            return res.status(404).send("Product was not found");
        }

        res.status(200).send(product);                      

    } catch (err) {
        res.status(400).send(err);
    }
}

productController.AddProduct = async (req, res) => {
    try {

        const categoryId = await categoryModel.findById(req.body.category);

        if(!categoryId) return res.status(400).send('invalid category');        

        const file = req.file;

        if(!file) return res.status(400).send('There is no image in the request');

        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        const newProduct = new productModel({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,            
            image: `${basePath}${fileName}`, //http://localhost:4000/public/upload/image-123123
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,            
            stock: req.body.stock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured        
        });

        let product = await newProduct.save();

        if(!product) {
            return res.status(500).json({
                message: "The product cannot be created",
                success: false
            })
        }

        res.status(201).send(product);
        
    } catch (err) {
        res.status(500).json({
            error: err,
            success: false
        });
    }
}

productController.updateProduct = async (req, res) => {
    try {

        //if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).send('Invalid ID');
        const category = await categoryModel.findById(req.body.category);
        if(!category) return res.status(400).send('Invalid Category');

        const { id } = req.params;

        const product = await productModel.findByIdAndUpdate(id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,            
                image: req.body.image,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,            
                stock: req.body.stock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured    
            }, 
            {new: true}
            );
        
            if(!product) {
                return res.status(500).json({
                    message: "We could not update the product",
                    success: false
                });
            }         

            res.status(200).send(product);            
    } catch (error) {
        res.status(400).json({
            message: "We could not update the product, invalid ID",
            success: false
        });
    }
}

productController.DeleteProduct = async (req, res) => {
    try {
        
        const { id } = req.params;

        const product = await productModel.findByIdAndRemove(id);

        if(!product) {
            return res.status(404).json({
                message: "Product was not found",
                success: false
            });
        }
        
        res.status(200).json({
            message: "The product was deleted successfully",
            success: true
        })

    } catch (error) {
        res.status(400).json({
            error: error,
            success: false
        })
    }
}

productController.updateGallery = async (req, res) => {
    try {

        //if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).send('Invalid ID');     
        const files = req.files;
        let imagesPaths = [];        
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if(files) {
            files.map(file => {
                imagesPaths.push(`${basePath}${file.filename}`);
            })
        }        
        const { id } = req.params;

        const product = await productModel.findByIdAndUpdate(id,
            {
              images: imagesPaths                    
            }, 
            {new: true}
            );
        
            if(!product) {
                return res.status(500).json({
                    message: "We could not update the product",
                    success: false
                });
            }         

            res.status(200).send(product);     

    } catch (error) {
        res.status(400).json({
            message: "We could not update the product, invalid ID",
            success: false
        });
    }
}

module.exports = productController;
