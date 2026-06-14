import { Router } from 'express';
import { url, redirectUrl, statsUrl, updateURL, deleteUrl } from '../controllers/url.controller';

const router = Router();

router.post('/', url);
router.get('/:shortCode', redirectUrl);
router.get('/:shortCode/stats', statsUrl);
router.put('/:shortCode', updateURL);
router.delete('/:shortCode', deleteUrl);

export default router;