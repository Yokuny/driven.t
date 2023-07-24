import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { userBooking, reserveRoom, changeReserve } from '@/controllers/booking-controller';
import { bookingObj } from '@/schemas';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', userBooking)
  .post('/', validateBody(bookingObj), reserveRoom)
  .put('/:bookingId', validateBody(bookingObj), changeReserve);

export { bookingRouter };
