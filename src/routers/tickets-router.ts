import { Router } from 'express';
import { authenticateToken } from '@/middlewares';

import { ticketsType, userTickets, postTickets } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/types', ticketsType).get('/', userTickets).post('/', postTickets);

export { ticketsRouter };
