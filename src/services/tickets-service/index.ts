import { TicketType } from '@prisma/client';
import ticketsRepository from '@/repositories/tickets-repository.ts';

export async function getAllTickets(): Promise<TicketType[]> {
  return await ticketsRepository.getAllTickets();
}

async function userTickets(id: number) {
  const ticket = await ticketsRepository.findUserTicket(id);
  if (!ticket) throw new Error('Usuário sem ingresso');
  return ticket;
  // puxar os erros de './errors';
  // if (!ticket) throw new TicketNotFound();
}

async function postTickets(ticketType: number, userId: number) {
  return await ticketsRepository.postTickets(ticketType, userId);
}

const ticketService = {
  getAllTickets,
  userTickets,
  postTickets,
};

export * from './errors';
export default ticketService;
