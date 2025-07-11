import express, { Router } from "express";
import { PrismaClient } from "@prisma/client";
import passport from "@/auth/passport";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router: Router = express.Router();
const prisma = new PrismaClient();

router.post("/signup", async(req,res) => {
    const {fullName, email, password} = req.body;

    if(!fullName || !email || !password){
        return res.status(400).json({error: "All field are required"});
    }

    const existingUser = await prisma.user.findUnique({where : {email}});

    if(existingUser){
        return res.status(400).json({ error: "Email already in use"});
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await prisma.user.create({
        data: {
            fullName,
            email,
            password: hashedPassword,
            username: email.split("@")[0]
        }
    });

    const token = jwt.sign({ userId : user.id }, process.env.JWT_SECRET!, { expiresIn : "7d"});

    res.status(201).json({
        token,
        user: { id: user.id, fullName: user.fullName, email: user.email}
    });
});

router.post("/signin", async(req,res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({ error : "All fields are required"});
    }

    const user = await prisma.user.findUnique({ where: {email} });

    if(!user){
        return res.status(401).json({ error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign({ userId : user.id }, process.env.JWT_SECRET!, {expiresIn : "7d"});

    res.json({
        token,
        user: { id: user.id, fullName: user.fullName, email: user.email } 
    })
});

router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}));

router.get(
    "/google/callback",
    passport.authenticate("google", {session:false, failureRedirect:"/"}),
    (req,res) => {
        const user = req.user as any;
        const token = jwt.sign({ userId: user.id}, process.env.JWT_SECRET!);

        res.redirect('https://green-care-gamma.vercel.app/auth/google/success?token=' + token);
    }
);

export default router;