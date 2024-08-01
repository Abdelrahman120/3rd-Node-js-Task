import jwt from "jsonwebtoken";
import { loadData } from "../utils/helpers.js";

const tokenKey = "1234assA@SSSS";

export const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.log("No Authorization header");
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            console.log("Token verification failed:", err.message);
            return res.status(401).json({ message: "Unauthorized" });
        }

        console.log("Token decoded:", decoded);

        const { id } = decoded;

        if (!id) {
            console.log("No user ID in token");
            return res.status(403).json({ message: "Access denied" });
        }

        const data = loadData();
        if (!Array.isArray(data)) {
            return res.status(500).json({ message: "Internal server error" });
        }

        const user = data.find((user) => user.id === id);
        if (!user) {
            console.log("User not found");
            return res.status(403).json({ message: "Access denied" });
        }

        req.user = user;
        next();
    });
};
