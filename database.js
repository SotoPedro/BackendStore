const mongoose = require('mongoose');
require('dotenv/config');

(async () => {
    try{
        const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.cfnuy.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
        const db = await mongoose.connect(MONGO_URI,{
            useCreateIndex: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

        console.log(`Db is connected to: ${db.connection.name}`);
    }
    catch(error){
        console.log(error);
    }
})()