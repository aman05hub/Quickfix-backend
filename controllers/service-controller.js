const Service = require("../models/Service-model");

//Create service (provider only  + restriction)
const createService = async (req, res) => {
    try{

        const { title, price, description, category } = req.body;

        const provider = req.user;

        if(provider.role !== "provider"){
            return res.status(403).json({
                message: "Only providers can add services",
            });
        }

        if(provider.profession !== category){
            return res.status(400).json({
                message: `You can only add services for your profession: ${provider.profession}`,
            })
        }

        if (!title || !price || !category){
            return res.status(400).json({
                message: "All required fields must be filled",
            });
        }

        //Cerate service
        const service = await Service.create({
            title,
            description,
            price,
            category,
            provider: provider._id,
        })

        res.status(201).json(service);

    }catch(err){
        res.status(500).json({
            message: err.message,
        })
    }
}

//Get all services for users
const getServices = async (req, res) => {
    try{
        const services = await Service.find()
        .populate("provider", "name email");

        res.json(services);

    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

//Get services by category
const getServicesByCategory = async (req, res) => {
    try{
        const { category } = req.query;

        const services = await Service.find({ category })
        .populate("provider", "name email");

        res.json(services);

    } catch (err){
        res.status(500).json({
            message: err.message
        });
    }
}

//Get provider's own services
const getMyServices = async (req, res) => {
    try{
        const services = await Service.find({
            provider: req.user._id,
        })

        res.json(services);

    }catch (err){
        res.status(500).json({
            message: err.message
        })
    }
}

//Update Service
const updateService = async (req,res) => {
    try{
        const service = await Service.findById(req.params.id);

        if(!service){
            return res.status(404).json({
                message: "Service not found",
            })
        }

        //Only owner can update
        if(service.provider.toString() !== req.user._id.toString()){
            return res.status(403).json({
                message: "Not authorized",
            })
        }

        const updated = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updated);

    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

//Delete Service
const deleteService = async (req, res) => {
    try{
        const service = await Service.findById(req.params.id);

        if(!service){
            return res.status(404).json({
                message: "Service not found",
            });
        }

        //Only owner can delete
        if(service.provider.toString() !== req.user._id.toString()){
            return res.status(403).json({
                message: "Not authorized",
            })
        }

        await service.deleteOne();

        res.json({
            message: "Service deleted",
        })

    } catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}


module.exports = { 
    createService , 
    getServices, 
    getServicesByCategory, 
    getMyServices, 
    updateService, 
    deleteService 
};