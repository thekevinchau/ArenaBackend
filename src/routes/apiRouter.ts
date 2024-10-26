import express, { Request, Response, Router } from 'express';
import authRouter from './authRoutes';
import User from '../entities/User';
import { verifyJWT } from '../utils/verifyJWT';
const apiRouter: Router = Router();


apiRouter.use('/auth', authRouter)


apiRouter.get('/', verifyJWT, async(req: Request, res: Response) => {
    res.send('Welcome to the express server!');
})


export default apiRouter;

