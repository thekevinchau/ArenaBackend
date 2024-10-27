import{ Request, Response, Router } from 'express';
import authRouter from './authRoutes';
import { verifyJWT } from '../utils/verifyJWT';
import reservationRouter from './reservationRouter';
const apiRouter: Router = Router();

apiRouter.use('/auth', authRouter)
apiRouter.use('/reservations',reservationRouter)


apiRouter.get('/', verifyJWT, async(req: Request, res: Response) => {
    res.send('Welcome to the express server!');
})


export default apiRouter;

