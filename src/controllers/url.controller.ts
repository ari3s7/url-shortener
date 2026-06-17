import  {prisma} from '../config/prisma';
import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { RedirectParams } from '../types/urlTypes';
import { redisClient } from '../config/redis';

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
        const shortCode = nanoid(7);

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

        const incrementClicks = async (shortCode: string) => {
    await prisma.url.update({
        where: { shortCode },
        data: {
            clicks: {
                increment: 1,
            },
        },
    });
};
    const cachedUrl = await redisClient.get(shortCode);

      if (cachedUrl) {
     await incrementClicks(shortCode)
    console.log("Cache Hit");

    return res.redirect(cachedUrl);
}
        console.log("Cache Miss");
        try {
            const urlEntry = await prisma.url.findUnique({
                where: { shortCode },
            });

            if (!urlEntry) {
                return res.status(404).json({ error: "URL not found" });
            }

            await redisClient.set(
                shortCode,
                urlEntry.originalUrl, {
                    EX: 3600,
                }
            );
           await incrementClicks(shortCode);
            return res.redirect(urlEntry.originalUrl);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to redirect URL" });
        }
    }

    const statsUrl = async (req: Request<RedirectParams>, res: Response) => {
        const { shortCode } = req.params;
        try{
             const urlEntry = await prisma.url.findUnique({
                where: { shortCode },
            });

            if (!urlEntry) {
                return res.status(404).json({ error: "URL not found" });
            }
            
            return res.json({
                shortCode: urlEntry.shortCode,
                originalUrl: urlEntry.originalUrl,
                clicks: urlEntry.clicks,
                createdAt: urlEntry.createdAt,
                updatedAt: urlEntry.updatedAt,
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to retrieve URL stats" });
        }
    }

    const updateURL = async (req: Request<RedirectParams>, res: Response) => {
      const{ shortCode } = req.params;
      const { originalUrl } = req.body;
   
      if(!originalUrl) {
        return res.status(400).json({ error: "originalUrl is required" });
    }
      try {
           new URL(originalUrl)
        } catch(error){
            console.log(error);
            return res.status(400).json({
                error: "Invalid URL"
            })
        }
    try{
          const existingUrl = await prisma.url.findUnique({
       where: { shortCode }
     });

     if (!existingUrl) {
     return res.status(404).json({
    error: "URL not found"
       });
}  
        const updateUrl = await prisma.url.update({
            where: { shortCode },
            data: { originalUrl },
        });

        await redisClient.del(shortCode);
        return res.json({
            originalUrl: updateUrl.originalUrl
        })
        
     } catch(error) {
        console.log(error);
        res.status(500).json({ error: "Failed to update URL" });
      }
    }

    const deleteUrl = async (req: Request<RedirectParams>, res: Response) => {
        const { shortCode } = req.params;
        try {
            const existingUrl = await prisma.url.findUnique({
                where: { shortCode },
            });

            if (!existingUrl) {
                return res.status(404).json({ error: "URL not found" });
            }

            await prisma.url.delete({
                where: { shortCode },
            });
            await redisClient.del(shortCode);

            return res.send(204).json({ message: "URL deleted successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to delete URL" });
        }
    }

    export {url, redirectUrl, statsUrl, updateURL, deleteUrl}