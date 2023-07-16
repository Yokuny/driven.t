import { Hotel } from '@prisma/client';
import enrollmentsService from '@/services/enrollments-service';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { notFoundError } from '@/errors';

const getAllHotels = async (userId: number): Promise<Hotel[]> => {
  const hotels = await hotelsRepository.getAllHotels();
  if (!hotels) throw notFoundError();

  const user = await enrollmentsService.getOneWithAddressByUserId(userId);
  if (!user) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(user.id);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'RESERVED')
    throw new Error(JSON.stringify({ type: 'BAD_REQUEST', message: 'Ticket not reserved' }));

  const ticketTypes = await ticketsRepository.findTicketTypes();
  const userTicketType = ticketTypes.find((ticketType) => ticketType.id === ticket.ticketTypeId);

  if (!userTicketType.isRemote) throw new Error(JSON.stringify({ type: 'BAD_REQUEST', message: 'Ticket not remote' }));
  if (!userTicketType.includesHotel)
    throw new Error(JSON.stringify({ type: 'BAD_REQUEST', message: 'Ticket not hotel' }));

  return hotels;
};

const getHotelRooms = async (userId: number, hotelId: number) => {
  if (!hotelId) throw new Error(JSON.stringify({ type: 'BAD_REQUEST', message: 'Missing hotelId' }));

  const hotelAndRooms = await hotelsRepository.getHotelRooms(hotelId);
  if (!hotelAndRooms) throw notFoundError();

  const user = await enrollmentsService.getOneWithAddressByUserId(userId);
  if (!user) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(user.id);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'RESERVED')
    throw new Error(JSON.stringify({ type: 'BAD_REQUEST', message: 'Ticket not reserved' }));

  const ticketTypes = await ticketsRepository.findTicketTypes();
  const userTicketType = ticketTypes.find((ticketType) => ticketType.id === ticket.ticketTypeId);

  if (!userTicketType.isRemote) throw new Error(JSON.stringify({ type: 'BAD_REQUEST', message: 'Ticket not remote' }));
  if (!userTicketType.includesHotel)
    throw new Error(JSON.stringify({ type: 'BAD_REQUEST', message: 'Ticket not hotel' }));

  return hotelAndRooms;
};

const hotelsService = {
  getAllHotels,
  getHotelRooms,
};

export default hotelsService;
