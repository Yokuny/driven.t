import { Response } from 'express';
import httpStatus from 'http-status';
import paymentsService from '@/services/payments-service';
import { AuthenticatedRequest } from '@/middlewares/authentication-middleware';

export async function paymentInfo(req: AuthenticatedRequest, res: Response) {
  const ticket = Number(req.query.ticketId);

  try {
    const status = await paymentsService.ticketIdStatus(ticket, req.userId, false);
    return res.status(httpStatus.OK).send(status);
  } catch (error) {
    if (error.type === 'USER_WITHOUT_TICKETS') return res.sendStatus(httpStatus.UNAUTHORIZED);
    if (error.type === 'NO_TICKET_ID') return res.sendStatus(httpStatus.BAD_REQUEST);
    if (error.type === 'NOT_OWNER') return res.sendStatus(httpStatus.UNAUTHORIZED);
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function makePayment(req: AuthenticatedRequest, res: Response) {
  const { ticketId, cardData } = req.body;

  try {
    const pay = await paymentsService.processPayment(ticketId, cardData, req.userId);
    return res.status(httpStatus.CREATED).send(pay);
  } catch (error) {
    if (error.type === 'USER_WITHOUT_TICKETS') return res.sendStatus(httpStatus.UNAUTHORIZED);
    if (error.type === 'NO_TICKET_ID') return res.sendStatus(httpStatus.BAD_REQUEST);
    if (error.type === 'NOT_OWNER') return res.sendStatus(httpStatus.UNAUTHORIZED);
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}
