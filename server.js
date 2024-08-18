const express = require('express');
const app = express();
const dotenv=require('dotenv');
const mongoose=require('mongoose')
const PORT=process.env.PORT||4000;
const bodyParser=require('body-parser')
const vendorRoutes = require("./Routes/vendorRoutes")
const firmRoutes=require("./Routes/firmRoutes")
const productRoutes=require("./Routes/productRoutes")
const path=require('path');
const cors=require('cors');

dotenv.config();
app.use(cors())
mongoose.connect(process.env.MONGO_URL)
 .then(()=>console.log("MongoDB connected successfully!"))
 .catch((err)=>console.log(err));

app.listen(PORT,()=>{
    console.log(`Server listening to ${PORT}`);
})

app.use(bodyParser.json());

app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'));

app.use('/',(req,res)=>{
    res.send("<h1>Welcome to Afreen's Zwiggy app!")
})

