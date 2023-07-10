import { Payment, Ticket } from '@prisma/client';
import { prisma } from '@/config';

async function paymentStatus(ticketId: number) {
  return prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { Payment: true },
  });
}

async function createPayment(paymentData: Omit<Payment, 'id'>) {
  return prisma.payment.create({
    data: paymentData,
  });
}

const payTicket = async (ticket: Ticket) => {
  try {
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: 'PAID' },
    });
    return updatedTicket;
  } catch (error) {
    throw new Error('Erro ao atualizar o status do ticket: ' + error.message);
  }
};

const enrollmentRepository = {
  paymentStatus,
  createPayment,
  payTicket,
};

export default enrollmentRepository;
