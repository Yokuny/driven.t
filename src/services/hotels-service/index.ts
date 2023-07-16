import { Hotel } from '@prisma/client';
import enrollmentsService from '@/services/enrollments-service';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsService from '@/services/tickets-service';
import ticketsRepository from '@/repositories/tickets-repository';
import { notFoundError } from '@/errors';

const getAllHotels = async (userId: number): Promise<Hotel[]> => {
  const hotels = await hotelsRepository.getAllHotels();
  if (!hotels) throw Error('NotFoundError');

  const user = await enrollmentsService.getOneWithAddressByUserId(userId);
  if (!user) throw Error('NotFoundError');

  const ticket = await ticketsService.getTicketByUserId(user.id);
  if (!ticket) throw Error('NotFoundError');

  if (ticket.status !== 'RESERVED') throw Error('UnauthorizedError');

  const userTicket = await ticketsRepository.findTicketByEnrollmentId(user.id);

  if (!userTicket.TicketType.includesHotel) throw Error('paymentError');
  if (!userTicket.TicketType.isRemote) throw Error('paymentError');

  return hotels;
};

const getHotelRooms = async (userId: number, hotelId: number) => {
  if (!hotelId) throw Error('NotFoundError');

  const hotelAndRooms = await hotelsRepository.getHotelRooms(hotelId);
  if (!hotelAndRooms) throw Error('NotFoundError');

  const user = await enrollmentsService.getOneWithAddressByUserId(userId);
  if (!user) throw Error('NotFoundError');

  const ticket = await ticketsService.getTicketByUserId(user.id);
  if (!ticket) throw Error('NotFoundError');

  if (ticket.status !== 'RESERVED') throw Error('UnauthorizedError');

  const ticketTypes = await ticketsService.getTicketType();
  const userTicketType = ticketTypes.find((ticketType) => ticketType.id === ticket.ticketTypeId);

  if (!userTicketType.isRemote) throw Error('UnauthorizedError');
  if (!userTicketType.includesHotel) throw Error('UnauthorizedError');

  return hotelAndRooms;
};

const hotelsService = {
  getAllHotels,
  getHotelRooms,
};

export default hotelsService;
