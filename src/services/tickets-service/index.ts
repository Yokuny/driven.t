import { TicketType } from '@prisma/client';

import ticketsRepository from '@/repositories/tickets-repository.ts';
import enrollmentService from '@/services/enrollments-service';

async function getAllTickets(): Promise<TicketType[]> {
  return await ticketsRepository.getAllTickets();
}

async function userTickets(id: number) {
  const ticket = await ticketsRepository.findUserTicket(id);
  if (!ticket) throw new Error(JSON.stringify({ type: 'NOT_OWNER', message: 'Ticket não encontrado' }));
  return ticket;
}

async function postTickets(Type: number, userId: number) {
  try {
    const allTypes = await ticketsRepository.getAllTickets();
    const theType = allTypes.find((type) => type.id === Type);
    if (!theType)
      throw new Error(
        JSON.stringify({
          type: 'NotFoundError',
          message: 'Tipo de ingresso não encontrado',
        }),
      );

    const userEntry = await enrollmentService.getOneWithAddressByUserId(userId);
    if (!userEntry) {
      throw new Error(
        JSON.stringify({
          type: 'WITHOUT_ENROLLMENT',
          message: 'Usuário sem matrícula',
        }),
      );
    }
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

export default ticketService;
