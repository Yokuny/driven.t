import { Router } from 'express';
import { authenticateToken, validateQuery, validateBody } from '@/middlewares';
import { paymentInfo, makePayment } from '@/controllers';
import { receivePaymentSchema, sendPaymentSchema } from '@/schemas/payments-schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/:ticketId', validateQuery(receivePaymentSchema), paymentInfo)
  .post('/process', validateBody(sendPaymentSchema), makePayment);

export { paymentsRouter };
