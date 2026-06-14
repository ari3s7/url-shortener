import  {prisma} from '../config/prisma';
import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { RedirectParams } from '../types/urlTypes';

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
    const redirectUrl = async (req: Request<RedirectParams>, res: Response) => {
        const { shortCode } = req.params;
        try {
            const urlEntry = await prisma.url.findUnique({
                where: { shortCode },
            });

            if (!urlEntry) {
                return res.status(404).json({ error: "URL not found" });
            }

            await prisma.url.update({
                where: { shortCode },
                data: { clicks: { increment: 1 } },
            });

            return res.redirect(urlEntry.originalUrl);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to redirect URL" });
        }
    }
    export {url, redirectUrl}