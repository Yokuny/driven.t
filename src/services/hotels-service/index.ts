import { Hotel } from '@prisma/client';
import enrollmentsService from '@/services/enrollments-service';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { notFoundError, unauthorizedError } from '@/errors';

const getAllHotels = async (userId: number): Promise<Hotel[]> => {
  const hotels = await hotelsRepository.getAllHotels();
  if (!hotels) throw notFoundError();

  const user = await enrollmentsService.getOneWithAddressByUserId(userId);
  if (!user) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(user.id);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'RESERVED') throw unauthorizedError();

  const ticketTypes = await ticketsRepository.findTicketTypes();
  const userTicketType = ticketTypes.find((ticketType) => ticketType.id === ticket.ticketTypeId);

  if (!userTicketType.isRemote) throw unauthorizedError();
  if (!userTicketType.includesHotel) throw unauthorizedError();

  return hotels;
};

const getHotelRooms = async (userId: number, hotelId: number) => {
  if (!hotelId) throw notFoundError();

  const hotelAndRooms = await hotelsRepository.getHotelRooms(hotelId);
  if (!hotelAndRooms) throw notFoundError();

  const user = await enrollmentsService.getOneWithAddressByUserId(userId);
  if (!user) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(user.id);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'RESERVED') throw unauthorizedError();

  const ticketTypes = await ticketsRepository.findTicketTypes();
  const userTicketType = ticketTypes.find((ticketType) => ticketType.id === ticket.ticketTypeId);

  if (!userTicketType.isRemote) throw unauthorizedError();
  if (!userTicketType.includesHotel) throw unauthorizedError();

  return hotelAndRooms;
};

const hotelsService = {
  getAllHotels,
  getHotelRooms,
};

export default hotelsService;
