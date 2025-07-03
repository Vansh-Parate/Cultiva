import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret as string);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};