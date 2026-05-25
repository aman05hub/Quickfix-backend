const isAdmin = (req, res, next) => {
    try{
        //Check if user exists
        if(!req.user){
            return res.status(401).json({
                success: false,
                message: "Not authorized. No user found",
            });
        }

        //Check if role is admin
        if(req.user.role !== "admin"){
            return res.status(403).json({
                success: false,
                message: "Not authorized. Admin only."
            })
        }

        //If admin -> continue
        next();
    } catch(err){
        console.log("Admin middleware Error:", err);
        res.status(500).json({
            success: false,
            message: "Server error in admin middleware",
        })
    }
};

module.exports = isAdmin;