import express from 'express';
import urlRoutes from './routes/url.routes';
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
   res.send('Hello World!');
})

app.use("/api/urls", urlRoutes);

export default app;