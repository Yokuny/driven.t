import { Router } from 'express';
import { authenticateToken } from '@/middlewares';

import { paymentInfo, postPayment } from '@/controllers';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken).get('/:ticketId', paymentInfo).post('/process', postPayment);

export { paymentsRouter };
