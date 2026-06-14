import { Router } from 'express';
import { url, redirectUrl } from '../controllers/url.controller';

const router = Router();

router.post('/', url);
router.get('/:shortCode', redirectUrl);

export default router;