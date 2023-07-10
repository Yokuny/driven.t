import { Ticket, TicketType, TicketStatus } from '@prisma/client';

import { prisma } from '@/config';

async function getAllTickets(): Promise<TicketType[]> {
  try {
    return await prisma.ticketType.findMany();
  } catch (error) {
    throw new Error('Falha ao obter tipos de ticket:' + error.message);
  }
} // done

async function findUserTicket(userId: number) {
  try {
    return await prisma.ticket.findFirst({
      where: {
        Enrollment: {
          userId: userId,
        },
      },
      include: {
        TicketType: true,
      },
    });
  } catch (error) {
    throw new Error('Falha ao obter ticket do usuário:' + error.message);
  }
} // done

async function postTickets(ticketType: number, userId: number) {
  try {
    return await prisma.ticket.create({
      data: {
        ticketTypeId: ticketType,
        enrollmentId: userId,
        status: TicketStatus.RESERVED,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    throw new Error('Falha ao criar ticket:' + error.message);
  }
} //done
const ticketsRepository = {
  getAllTickets,
  findUserTicket,
  postTickets,
};

export default ticketsRepository;
