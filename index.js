const express = require('express'); //we create the constant express to create our server.
const app = express();
const morgan = require('morgan');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const cors = require('cors');
require('dotenv/config');
require('./database');

//Routes Required
const products = require('./routes/products.routes')
const users = require('./routes/user.routes');
const orders = require('./routes/order.routes');
const categories = require('./routes/category.routes');

//to use .env archive, i have to install dotenv before so I can user process.env.Variable
 
//Configuration
app.set('port',process.env.PORT || 3000);

//Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(authJwt());
app.use(errorHandler);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/public/uploads', express.static(__dirname + '/public/uploads' )) //set the folder publics as static folder


//Routes
app.get('/', (req, res) => {
    res.status(200).json({msg: 'Hello'})
});

app.use(`${process.env.API_URL}/products`,products);
app.use(`${process.env.API_URL}/users`,users);
app.use(`${process.env.API_URL}/orders`,orders);
app.use(`${process.env.API_URL}/categories`,categories);
//Server
app.listen(app.get('port'), _ => {
    console.log(`Server running on port ${app.get('port')}`)    
});
