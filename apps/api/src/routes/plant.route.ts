import multer from 'multer';
import express from 'express';
import { uploadImageToS3 } from '@/s3';
import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { authenticateJWT } from '@/middleware/authMiddleware';

const router:Router = express.Router();
const upload = multer();
const prisma = new PrismaClient();

router.post('/',
    authenticateJWT,
    upload.single('image'),
    async(req,res) => {
        try{
            const { name,speciesId, description } = req.body;
            const file = req.file;

            if(!file){
                return res.status(400).json({ error : 'Image file is required'});
            }

            const imageUrl = await uploadImageToS3(file.buffer, file.mimetype);

            const userId = (req as any).user?.userId;

            const plant = await prisma.plant.create({
                data:{
                    name,
                    description,
                    userId,
                    speciesId,
                    images: {
                        create: [
                            {
                                url: imageUrl,
                                isPrimary: true,
                            }
                        ]
                    }
                },
                include: { images : true}
            })

            res.status(201).json(plant);
        } catch(err){
            console.error(err);
            res.status(500).json({ error: 'Failed to add plant' });
        }
    });

router.get('/',authenticateJWT, async(req,res) =>{
    try{
    const userId = (req as any)?.userId;
    
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const plants = await prisma.plant.findMany({
        where: {userId},
        include: { images:true, species: true}
    })

    res.json(plants);
   }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch plants '});
   }
})    

export default router;    