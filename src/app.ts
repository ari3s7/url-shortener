import express from 'express';
import urlRoutes from './routes/url.routes';
import { urlLimiter } from './middleware/rateLimit';
const app = express();

app.use(express.json());


app.use("/api/urls", urlLimiter, urlRoutes);

export default app;