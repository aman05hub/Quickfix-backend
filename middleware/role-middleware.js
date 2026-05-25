const allowRoles = (...roles) => {
    return (req, res, next) => {
        try{
            if(!req.user){
                return res.status(401).json({
                    success: false,
                    message: "Not authorized",
                });
            }

            if(!roles.includes(req.user.role)){
                return res.status(403).json({
                    success: false,
                    message: "Access denied",
                });
            }

            next();
        } catch(err){
            res.status(500).json({
                message: "Role middleware error",
            })
        }
    }
}

module.exports = allowRoles;