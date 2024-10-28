import {Router} from 'express';
import { createReservation, deleteReservation, editReservation } from '../controllers/reservationController';
import { verifyJWT } from '../utils/verifyJWT';

const reservationRouter: Router = Router();

reservationRouter.post('/', verifyJWT, createReservation)
reservationRouter.put('/edit', verifyJWT, editReservation)
reservationRouter.delete('/delete', verifyJWT, deleteReservation)

export default reservationRouter;