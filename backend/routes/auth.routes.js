import { Router } from 'express';
import { signUp, signIn } from '../controllers/auth.controller.js';

console.log('Auth router files is processing a request.');

const authRouter = Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);

export default authRouter;
