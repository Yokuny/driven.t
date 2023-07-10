import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { ticketsType, userTickets, postTickets } from '@/controllers';
import { ticketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', ticketsType)
  .get('/', userTickets)
  .post('/', validateBody(ticketSchema), postTickets);

export { ticketsRouter };
