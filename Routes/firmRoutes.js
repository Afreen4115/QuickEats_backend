const express = require('express');
const firmController = require('../Controllers/firmController');
const verifyToken = require('../Middlewares/verifyToken'); 

const router = express.Router();

router.post('/add-firm', verifyToken, firmController.addFirm);

router.get('/uploads/:imageName',(req,res)=>{
    const imageName=req.params.imageName;
    res.headerSent('Content-Type','image/jpeg');
    res.sendFile(path.join(__dirname,'..','uploads',imageName));
});

router.delete('/:firmId',firmController.deleteFirmById);

router.put('/:firmId',firmController.updateFirm);

module.exports = router;
