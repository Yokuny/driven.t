import { TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function getAllTickets(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function findUserTicket(userId: number) {
  return await prisma.ticket.findFirst({
    where: {
      enrollmentId: userId,
    },
  });
}

async function postTickets(ticketType: number, userId: number) {
  try {
    return await prisma.ticket.create({
      data: {
        ticketTypeId: ticketType,
        enrollmentId: userId,
        status: 'RESERVED',
      },
    });
  } catch (error) {
    throw new Error(error);
  }
}

const ticketsRepository = {
  getAllTickets,
  findUserTicket,
  postTickets,
};

export default ticketsRepository;
