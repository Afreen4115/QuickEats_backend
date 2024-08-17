const Firm = require('../Models/Firm');
const Vendor = require('../Models/Vendor');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });
const addFirm = async(req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            res.status(404).json({ message: "Vendor not found" })
        }
        const firm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id
        });
       const saveFirm= await firm.save();
       vendor.firm.push(saveFirm);
       await vendor.save();
       return res.status(200).json({ message: 'Firm Added successfully '});
    } catch (error) {
        console.error(error);
        res.status(500).json("intenal server error");
    }
}
const deleteFirmById=async(req,res)=>{
    try {
        const firmId=req.params.firmId;
        const deleteFirm=await Firm.findByIdAndDelete(firmId);
        if(!deleteFirm){
            return res.status(404).json({error:"No firm is found"});
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal server error"})
    }
}
const updateFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const { firmName, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ message: "Firm not found" });
        }

        firm.firmName = firmName || firm.firmName;
        firm.area = area || firm.area;
        firm.category = category || firm.category;
        firm.region = region || firm.region;
        firm.offer = offer || firm.offer;
        if (image) {
            firm.image = image;
        }

        const updatedFirm = await firm.save();
        return res.status(200).json({ message: 'Firm updated successfully', firm: updatedFirm });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = { addFirm: [upload.single('image'), addFirm],deleteFirmById,updateFirm}