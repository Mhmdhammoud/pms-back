import express from 'express';
const router = express.Router();
import { getAll, getByID } from '../controllers/projects/index.js';
import { ValidateID } from '../middleware/index.js';
router.route('/getAll').get(getAll);
router.route('/getByID').get(ValidateID, getByID);

export default router;
