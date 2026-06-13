import  {prisma} from '../config/prisma';
import { Request, Response } from 'express';
import { nanoid } from 'nanoid';

const url = async (req: Request, res: Response) => {
    
        const {  originalUrl  } = req.body;
        if(!originalUrl) {
            return res.status(400).json({ error: "originalUrl is required" });
        }
        try {
           new URL(originalUrl);
     } catch {
          return res.status(400).json({
        error: "Invalid URL"
          });
     }
        const shortCode = nanoid(6);

        try{
            const createdUrl = await prisma.url.create({
            data: {
                originalUrl,
                shortCode,
            },
        });

        res.status(201).json({
            shortCode,
            shortUrl: `http://localhost:3000/${shortCode}`,
        });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to create URL" });
        }
        
    }

    export {url}