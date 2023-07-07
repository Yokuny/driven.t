import { Request, Response } from 'express';
import { TicketType } from '@prisma/client';
import httpStatus from 'http-status';
import ticketService from '@/services/tickets-service';
import { AuthenticatedRequest } from '@/middlewares/authentication-middleware';

export async function ticketsType(req: Request, res: Response) {
  try {
    const tickets = await ticketService.getAllTickets();
    if (tickets.length === 0) return res.status(httpStatus.OK).json([]);

    const response = tickets.map((ticket: TicketType) => ({
      id: ticket.id,
      name: ticket.name,
      price: ticket.price,
      isRemote: ticket.isRemote,
      includesHotel: ticket.includesHotel,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    }));

    return res.status(httpStatus.OK).json(response);
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao buscar tipos de ingresso.' });
  }
}

export async function userTickets(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  try {
    const ticket = await ticketService.userTickets(userId);
    return res.status(httpStatus.OK).json(ticket);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).json({ message: error.message });
  }
}

export async function postTickets(req: Request, res: Response) {
  return await ticketService.postTickets(parseInt(req.body.ticketTypeId), parseInt(req.body.id));
}
