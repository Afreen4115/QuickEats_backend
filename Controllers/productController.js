const Firm = require("../Models/Firm");
const Vendor = require("../Models/Vendor");
const multer=require('multer');
const Product=require("../Models/Product")

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

const addProduct=async(req,res)=>{
    try {
        const {productName,price,category,bestSeller,description}=req.body;
        const image = req.file ? req.file.filename : undefined;
        
        const firmId=req.params.firmId;
        const firm=await Firm.findById(firmId);
        if(!firm){
            return res.status(404).json({error:"No Firm found"});
        }
        const product=new Product({
            productName,
            price,
            category,
            bestSeller,
            description,
            image,
            firm:firm._id
        });
        const savedProduct=await product.save();
        firm.products.push(savedProduct);
        await firm.save();
        res.status(200).json({savedProduct})
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal server error!"})
    }
}

const getProductByFirm=async(req,res)=>{
    try {
        const firmId=req.params.firmId;
        const firm=await Firm.findById(firmId);
        if(!firm){
            return res.status(404).json({error:"No Firm found"});
        }
        const restaurantName=firm.firmName;
        const products=await Product.find({firm:firmId});
        res.status(200).json({restaurantName,products});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal server error!"})
    }
}

const deleteProductById=async(req,res)=>{
    try {
        const productId=req.params.productId;
        const deleteProduct=await Product.findByIdAndDelete(productId);
        if(!deleteProduct){
            return res.status(404).json({error:"No product found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal server error!"});
    }
}
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { productName, price, category, bestSeller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        product.productName = productName || product.productName;
        product.price = price || product.price;
        product.category = category || product.category;
        product.bestSeller = bestSeller || product.bestSeller;
        product.description = description || product.description;
        if (image) {
            product.image = image;
        }

        const updatedProduct = await product.save();
        return res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
module.exports={addProduct:[upload.single('image'),addProduct],getProductByFirm,deleteProductById,updateProduct}