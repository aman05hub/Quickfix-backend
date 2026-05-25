const Booking = require("../models/Booking-model");
const Service = require("../models/Service-model");

async function createBooking(req,res){
    try{
        const { serviceId, date, time, address, phone } = req.body;

        //Find service
        const service = await Service.findById(serviceId);

        if(!service){
            return res.status(400).json({ message: "Service not found "});
        }

        //Check duplicate
        const existingBooking = await Booking.findOne({
            user: req.user._id,
            service: serviceId,
            status: { $ne: "completed" },
        });

        if(existingBooking){
            return res.status(400).json({
                message: "You already have an active booking for this service",
            });
        }

        //Create Booking
        const booking = await Booking.create({
            user: req.user._id,
            service: serviceId,
            provider: service.provider,
            serviceType: service.title.toLocaleLowerCase(),
            price: service.price,
            date : new Date(date),
            time,
            address,
            phone
        });

        //Send response
        res.status(201).json(booking);

    }catch(err){
        res.status(500).json({ message: err.message });
    }
}

//Get
async function getMyBookings(req,res){
    try{
        const bookings = await Booking.find({ user: req.user._id })
        .populate("service")
        .populate("provider", "name email");

        res.json(bookings);
    } catch (err){
        res.status(500).json({ message: err.message})
    }
}

//Get provider booking
async function getProviderBookings(req,res){
    try{
        const bookings = await Booking.find({ provider: req.user._id })
        .populate("user","name email")
        .populate("service");

        res.json(bookings);

    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

async function updateBookingStatus(req,res){
    try{
        const { id } = req.params;
        const { status } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            id,
            {status},
            {new: true}
        );

        if(!booking){
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json(booking);

    }catch(err){
        res.status(500).json({ message: err.message });
    }
}

async function payBooking(req, res){
    try{

        const booking = await Booking.findById(req.params.id);

        if(!booking){
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.paymentStatus = "paid";
        booking.paymentId = "PAY_" + Date.now();
        booking.paymentEmail = req.user.email;

        await booking.save();

        res.json(booking);

    }catch(err){
        res.status(500).json({ message: err.message });
    }
}

async function createBookingAfterPayment(req, res){
    try{
        const { serviceId, date, time, address, phone } = req.body;

        const service = await Service.findById(serviceId);

        if(!service){
            return res.status(400).json({ message: "Service not found"});

        }
        const booking = await Booking.create({
            user: req.user._id,
            service: serviceId,
            provider: service.provider,
            serviceType: service.title.toLowerCase(),
            price: service.price,
            date: new Date(date),
            time,
            address,
            phone,
            paymentStatus: "paid"
        });
        res.json(booking);
    } catch(err){
        res.status(500).json({ message: err.message });
    }
}

module.exports = { 
    createBooking, 
    getMyBookings, 
    getProviderBookings,
    updateBookingStatus,
    payBooking,
    createBookingAfterPayment
 };