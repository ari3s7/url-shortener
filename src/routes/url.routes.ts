import { Router } from 'express';
import { url } from '../controllers/url.controller';

const router = Router();

router.post('/', url);

export default router;