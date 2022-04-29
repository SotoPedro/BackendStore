const orderModel = require('../models/orders');
const orderitemModel = require('../models/orderItems');

const orderController = { }

orderController.getAll = async (req, res) => {
    try {

        const orders = await orderModel.find().populate('user','name').sort({'datedOrdered':-1}).lean();

        if(!orders) {
            return res.status(400).send('There are no orders');
        }
        res.status(200).send(orders);

    } catch (error) {
        res.status(400).send(error);
    }
}

orderController.getOne = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await orderModel.findById(id)
        .populate('user','name')
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: { 
                    path: 'category', select: 'name'}
                } 
            })
        .lean() //this is another way to populate, so
        //once we are inside the array, we create an object to define what we want to populate

        if(!order) {
            return res.status(400).send('Order was not found');
        }

        res.status(200).send(order);

    } catch (err) {
        res.status(400).send(err);
    }
}

orderController.createOrder = async (req, res) => {
    try {

        const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
            let newOrderItem = new orderitemModel({
                product: orderItem.product,
                quantity: orderItem.quantity
            });

            let order = await newOrderItem.save();

            return order._id;
        }))

        const orderIds = await orderItemsIds;        
        
        const totalPrices = await Promise.all(orderIds.map(async orderItemId=> {
            const orderItem = await orderitemModel.findById(orderItemId).populate('product','price');
            const total = orderItem.product.price * orderItem.quantity;

            return total;
        }))

        const totalPrice = totalPrices.reduce((a,b) => a+ b,0);        

        const newOrder = new orderModel({      
            orderItems: orderIds,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user
        });

        let order = await newOrder.save();

        if(!order) {
            return res.status(400).json({
                message: "The order cannont be created",
                success: false
            })
        }
        
        res.status(200).send(order);

    } catch (error) {
        res.status(400).send(error+"order cannot be created");
    }
}

orderController.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await orderModel.findByIdAndUpdate(id,
            {
                status: req.body.status
            },{new: true}
        );

        if(!order) {
            return res.status(400).send('Any order were updated');
        }
        res.status(200).send(order);
                        
    } catch (err) {
        res.status(400).send(err);
    }
}

orderController.deleteOrder = async (req, res) => {
    try {        
        const { id } = req.params;
       
        const order = await orderModel.findByIdAndRemove(id);

       if(!order) {           
            return res.status(400).json({
                message: "Order cannot be found",
                success: false
            });
        }        
        await order.orderItems.map(async orderItem => {
            await orderitemModel.findByIdAndRemove(orderItem);                        
        });
        
        res.status(200).json({
           message: "Order deleted",
            success: true
        });


    } catch (err) {
        res.status(400).send({
            message: err,
            success: false
        });
    }
}

orderController.getTotal = async (req, res) => {
    try {
        const totalSales = await orderModel.aggregate([
            { $group: {_id: null, totalsales: { $sum: '$totalPrice'}}}
        ])

        if(!totalSales) {
            return res.status(400).send('The order sales cannot be generated')
        }

        res.status(200).send({totalSales: totalSales.pop().totalsales});

    } catch (err) {
        res.status(400).send(err);
    }
}

orderController.getcount = async (req, res) => {
    try {

        const orderCount = await orderModel.countDocuments(doc => doc);

        if(!orderCount) {
            return res.status(400).send({success: false});
        }

        res.status(200).send({count: orderCount});

    } catch (err) {
        res.status(400).send(err);
    }   
}

orderController.getUserOrder = async (req, res) => {
    try {

        const userOrders = await orderModel.find({user: req.params.userId})
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category'}
            })
        .sort({'datedOrdered':-1})
        .lean();

        if(!userOrders) {
            return res.status(400).send('There are no orders');
        }
        res.status(200).send(userOrders);

    } catch (error) {
        res.status(400).send(error);
    }
}
module.exports  = orderController;