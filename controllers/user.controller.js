const userModel = require('../models/users');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const userController = { };

userController.getAll = async (req, res) => {
    try {
        
        const users = await userModel.find().select("-passwordHash").lean();

        if(!users){
            return res.status(201).send('There are no users');
        }        
        res.status(200).send(users);

    } catch (error) {
        res.status(500).json({success: false});
    }
}

userController.getOne = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id).select("-passwordHash").lean();

        if(!user){
            return res.status(404).send("The user was not found");
        }

        res.status(200).send(user);

    } catch (err) {
        res.status(400).send(err);
    }
}
userController.createUser = async (req, res) => {
    try {
        const foundUser = await userModel.findOne({email: req.body.email});

        if(foundUser){
            return res.status(301).send("The email already exist on the database");
        }

        const user = new userModel({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country            
        });
        let newUser = await user.save();

        if(!newUser) {
            return res.status(400).json({
                message: 'The user cannot be created',
                succes: false
            });            
        }

        res.status(200).send(newUser);        
    } catch (err) {
        res.status(400).send(err);
    }
}
userController.signUp = async (req, res) => {
    try {
        
        const foundUser = await userModel.findOne({email: req.body.email});

        if(foundUser){
            return res.status(301).send("The email already exist on the database");
        }

        const user = new userModel({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country            
        });

        let newUser = await user.save();

        if(!newUser) {
            return res.status(500).json({
                message: 'The user cannot be created',
                succes: false
            });            
        }

        res.status(200).send(newUser);        

    } catch (error) {
        res.status(400).send(error);
    }
}

userController.signIn = async (req, res) => {
    try {
        const user = await userModel.findOne({email: req.body.email});
        const secretKey = process.env.SECRET_KEY;

        if(!user) {
            return res.status(400).send('User was not found');
        }

        if(user && bcrypt.compareSync(req.body.password,user.passwordHash)) 
        {
            //with the method sign we can create a jwt we pass the varaiable
            const token = jwt.sign(
                {
                    userId: user.id,
                    isAdmin: user.isAdmin                
                },
                secretKey,
                {expiresIn: '1d'}
            );            
            res.status(200).send(
                {
                    user: user.email,
                    token: token
                }
            );

        } else {
            res.status(400).send("Password is wrong!");
        }          

    } catch (err) {
        res.status(400).send(err);
    }
}

userController.updateUser = async (req, res) => {
    try {        
        const { id } = req.params;

        const user = await userModel.findById(id);
        let newPassword;

        if(req.body.password) {
            newPassword = bcrypt.hashSync(req.body.password, 10);
        } else {
            newPassword = user.passwordHash;
        }

        const newUser = await userModel.findByIdAndUpdate(id,
            {
                name: req.body.name,
                email: req.body.email,
                passwordHash: newPassword,
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
                street: req.body.street,
                apartment: req.body.apartment,
                zip: req.body.zip,
                city: req.body.city,
                country: req.body.country
            }, {new: true});
        
            if(!newUser) {
                return res.status(400).send('User cannot be created');
            }

            res.status(200).send(newUser);
    } catch (err) {
        res.status(400).send(err);
    }
}

userController.deleteUser = async (req, res) => {
    try {
        
        const { id } = req.params;

        const deletedUser = await userModel.findByIdAndRemove(id);

        if(!deletedUser) {
            return res.status(400).send('Any user were deleted');
        }
        
        res.status(200).send('User has been deleted');

    } catch (error) {
        res.status(400).send(error);
    }
}

userController.getCount = async (req, res) => {
    try {
        const countUsers = await userModel.countDocuments(doc => doc);

        if(!countUsers) {
            return res.status(500).json({success: false});
        }

        res.status(200).send({count: countUsers});
    } catch(err) {
        res.status(400).send(err);
    }
}
module.exports = userController;