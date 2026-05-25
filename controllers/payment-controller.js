const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
});

const createOrder = async (req, res) => {
    try{
        const options = {
            amount: req.body.amount * 100,
            currency: "INR"
        };
        
        const order = await razorpay.orders.create(options);
        res.json(order);
    
    } catch (err){
        res.status(500).json({ message: err.message });
    }
};

module.exports = createOrder;