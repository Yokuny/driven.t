import { prisma } from '@/config';
import { PaymentParams } from '@/protocols';

async function findPaymentByTicketId(ticketId: number): Promise<PaymentParams> {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function createPayment(ticketId: number, params: PaymentParams): Promise<PaymentParams> {
  return prisma.payment.create({
    data: {
      ticketId,
      ...params,
    },
  });
}

export default { findPaymentByTicketId, createPayment };