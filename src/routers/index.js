import express from "express";
import product from './productRouter.js';
import user from './userRouter.js';
import message from './messageRouter.js';

const router = express.Router();

router.use('/products', product);
router.use('/account', user);
router.use('/message', message);

export default router;