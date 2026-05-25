const express = require("express");
const router = express.Router();

const { 
    createService, 
    getServices, 
    getServicesByCategory, 
    getMyServices, 
    updateService, 
    deleteService 
} = require("../controllers/service-controller");

const Service = require("../models/Service-model");

const { protect } = require("../middleware/auth-middleware");
const allowRoles = require("../middleware/role-middleware");

//Get all services
router.get("/",getServices);

//Get single service by ID
router.get("/:id", async (req,res) => {
    try{
        const service = await Service.findById(req.params.id)
        .populate("provider", "name email");
    
        if(!service){
            return res.status(404).json({
                message: "Service not found"
            });
        }
        res.json(service);

    } catch (err){
        res.status(500).json({
            message: err.message
        });
    }
});


//Get services by category
router.get("/filter", getServicesByCategory);

//Provider routes
//Create service
router.post("/", protect, allowRoles("provider"), createService);

//Get provider services
router.get("/my", protect, allowRoles("provider"), getMyServices);

//update service
router.put("/:id", protect,allowRoles("provider"), updateService);

//Delete service
router.delete("/:id", protect, allowRoles("provider"), deleteService);

module.exports = router;