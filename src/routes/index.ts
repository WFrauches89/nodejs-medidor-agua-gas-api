import express from 'express';
import { uploadRouter } from './upload';
import { confirmRouter } from './confirm';
import { listRouter } from './list';

const router = express.Router();

router.use('/upload', uploadRouter);
router.use('/confirm', confirmRouter);
router.use('/:customer_code/list', listRouter);

export default router;
