const categoryModel = require('../models/category');

const categoryController = { }

categoryController.getAll = async (req, res) => {
    try {
        
        const categories = await categoryModel.find().lean();       

        if(!categories) {
            return res.status(404).json({
                message: "The are no categories yet",
                success: false                
            })
        }
        res.status(200).send(categories);

    } catch (err) {
        res.status(400).send(err);
    }
}


categoryController.getOne = async (req, res) => {
    try {
        
        const { id } = req.params;
        const category = await categoryModel.findById(id).lean();

        if(!category) {
            return res.status(404).json({
                message: "The category was not found",
                success: false
            })
        }
        res.status(200).send(category);

    } catch (error) {
        res.status(400).send(error);
    }
}

categoryController.addCategory = async (req, res) => {
    try {
        const newCategory = new categoryModel({
            name: req.body.name,
            color: req.body.color,
            icon: req.body.icon
        });

        let category = await newCategory.save();

        if(!category) {
            return res.status(400).json({
                message: "The category cannont be created",
                success: false
            })
        }

        res.status(200).send('Category has been created');
    } catch (error) {
        res.status(400).send(error+"Category cannot be created");
    }
}

categoryController.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await categoryModel.findByIdAndDelete(id);

        if(!category) {
            return res.status(404).json({
                message: "Category was not found",
                success:false
            });
        }
        res.status(200).json({
            message: "Category deleted",
            success: true
        })
    } catch (error) {
        res.status(400).send({
            message: error,
            success: false
        });
    }
}

categoryController.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const newCategory = await categoryModel.findByIdAndUpdate(id,req.body,{new: true});

        if(!newCategory){
            return res.status(201).send('Any videos were updated');
        }
        res.status(200).json(newCategory);
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports  = categoryController;