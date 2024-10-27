import {Router} from 'express';
import { createReservation } from '../controllers/reservationController';
import { verifyJWT } from '../utils/verifyJWT';

const reservationRouter: Router = Router();

reservationRouter.post('/', verifyJWT, createReservation)

export default reservationRouter;