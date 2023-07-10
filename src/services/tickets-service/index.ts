import { TicketType } from '@prisma/client';

import ticketsRepository from '@/repositories/tickets-repository.ts';
import enrollmentService from '@/services/enrollments-service';

export async function getAllTickets(): Promise<TicketType[]> {
  return await ticketsRepository.getAllTickets();
} // done

async function userTickets(id: number) {
  const ticket = await ticketsRepository.findUserTicket(id);
  if (!ticket) throw new Error('Usuário sem ingresso');
  return ticket;
  // puxar os erros de './errors';
  // if (!ticket) throw new TicketNotFound();
} // done

async function postTickets(Type: number, userId: number) {
  const allTypes = await ticketsRepository.getAllTickets();
  const theType = allTypes.find((type) => type.id === Type);
  if (!theType) throw new Error('Tipo do ingresso não reconhecido');
  try {
    const userEntry = await enrollmentService.getOneWithAddressByUserId(userId);
    const newTicket = await ticketsRepository.postTickets(Type, userEntry.id);

    return {
      id: newTicket.id,
      status: newTicket.status,
      ticketTypeId: newTicket.ticketTypeId,
      enrollmentId: newTicket.enrollmentId,
      TicketType: theType,
      createdAt: newTicket.createdAt,
      updatedAt: newTicket.updatedAt,
    };
  } catch (error) {
    throw new Error(error);
  }
}

const ticketService = {
  getAllTickets,
  userTickets,
  postTickets,
};

export * from './errors';
export default ticketService;
