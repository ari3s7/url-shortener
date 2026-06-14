import { Router } from 'express';
import { url, redirectUrl, statsUrl, updateUrl, deleteUrl } from '../controllers/url.controller';

const router = Router();

router.post('/', url);
router.get('/:shortCode', redirectUrl);
router.get('/:shortCode/stats', statsUrl);
router.put('/:shortCode', updateUrl);
router.delete('/:shortCode', deleteUrl);

export default router;