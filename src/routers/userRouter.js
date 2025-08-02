import express from 'express';
import { createNewUser, LoginUser } from '../Controller/userController';

const router = express.Router();

router.post('/login', LoginUser);
router.post('/signUp', createNewUser);

export default router;