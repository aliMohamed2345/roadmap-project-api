import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        //check if the token exist
        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized: no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; // attaches decoded token data 
        next();
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return res
            .status(401)
            .json({ success: false, message: `Invalid or expired token:${error.message}` });
    }
};
