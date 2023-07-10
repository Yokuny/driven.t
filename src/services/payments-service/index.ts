import { Ticket, Payment } from '@prisma/client';
import ticketsService from '@/services/tickets-service';
import paymentRepository from '@/repositories/payment-repository';
import { Card } from '@/protocols';

const ticketIdStatus = async (ticketId: number, userId: number, toReturn: boolean) => {
  const payment = await paymentRepository.paymentStatus(ticketId);
  if (!payment || payment === null)
    throw new Error(
      JSON.stringify({
        type: 'NO_TICKET_ID',
        message: 'Ticket não encontrado',
      }),
    );

  const tickets = await ticketsService.userTickets(userId);
  if (toReturn) return tickets as Ticket | null;

  return payment.Payment[0];
};

const processPayment = async (ticketId: number, cardData: Card, userId: number) => {
  const ticket = await ticketIdStatus(ticketId, userId, true);
  await paymentRepository.payTicket(ticket as Ticket);

  const type = await ticketsService.getAllTickets();
  const ticketType = type.find((type) => type.id === (ticket as Ticket)?.ticketTypeId);

  if (!ticket || !ticketType) throw new Error('Ticket or TicketType not found');
  const finalNumbers = cardData.number.toString().substring(cardData.number.toString().length - 4);

  const value = ticketType.price;

  const paymentData: Omit<Payment, 'id'> = {
    ticketId: ticket.id,
    value: value,
    cardIssuer: cardData.issuer,
    cardLastDigits: finalNumbers,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const insertedPayment = await paymentRepository.createPayment(paymentData);
  return insertedPayment;
};

async function payTicket(ticket: Ticket) {
  const paidTicket = await paymentRepository.payTicket(ticket);
  return paidTicket;
}

const paymentsService = {
  ticketIdStatus,
  processPayment,
  payTicket,
};

export default paymentsService;
