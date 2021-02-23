import express from 'express';
const router = express.Router();
import { getAll } from '../controllers/projects/index.js';

router.route('/getAll').get(getAll);

export default router;
