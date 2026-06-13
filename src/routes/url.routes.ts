import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.send('url routes working');
});

export default router;