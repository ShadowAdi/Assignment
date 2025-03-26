import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided."
        });
    }

    try {
        const JWT_SECRET = process.env.JWT_SECRET
        if (!JWT_SECRET) {
            return res.status(403).json({
                success: false,
                message: "Jwt Do Not Exist"
            });
        }
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        if (decoded.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Admin access required"
            });
        }

        req.admin = decoded; // Store admin details in request
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
            error: error.message
        });
    }
};
