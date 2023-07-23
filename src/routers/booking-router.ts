import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { userBooking } from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('/', userBooking);

export { bookingRouter };
