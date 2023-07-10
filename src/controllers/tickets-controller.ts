import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketService from '@/services/tickets-service';
import { AuthenticatedRequest } from '@/middlewares/authentication-middleware';

export async function ticketsType(req: Request, res: Response) {
  try {
    const tickets = await ticketService.getAllTickets();
    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send([]);
  }
}

export async function userTickets(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  try {
    const ticket = await ticketService.userTickets(userId);
    return res.status(httpStatus.OK).json(ticket);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send([]);
  }
}

export async function postTickets(req: Request, res: Response) {
  try {
    const ticket = await ticketService.postTickets(parseInt(req.body.ticketTypeId), parseInt(req.body.id));
    return res.status(httpStatus.CREATED).json(ticket);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send([]);
  }
}
