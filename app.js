require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require("./db/connect");
const productsRoute = require('./routes/products')
const PORT = 8000


app.use(express.json())

//routes
app.use('/api/v1/products/',productsRoute);


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, () => {
            console.log(`Server running on PORT ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start();