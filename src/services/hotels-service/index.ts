import { Hotel } from '@prisma/client';
import enrollmentsService from '@/services/enrollments-service';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';

const getAllHotels = async (userId: number): Promise<Hotel[]> => {
  const hotels = await hotelsRepository.getAllHotels();
  if (!hotels) throw new Error(JSON.stringify({ type: 'NOT_FOUND', message: 'Hotels not found' }));

  const user = await enrollmentsService.getOneWithAddressByUserId(userId);
  if (!user) throw new Error(JSON.stringify({ type: 'NOT_FOUND', message: 'User not found' }));

  const ticket = await ticketsRepository.findTicketByEnrollmentId(user.id);
  if (!ticket) throw new Error(JSON.stringify({ type: 'NOT_FOUND', message: 'Ticket not found' }));

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
  if (!hotelAndRooms) throw new Error(JSON.stringify({ type: 'NOT_FOUND', message: 'Hotel not found' }));

  const user = await enrollmentsService.getOneWithAddressByUserId(userId);
  if (!user) throw new Error(JSON.stringify({ type: 'NOT_FOUND', message: 'User not found' }));

  const ticket = await ticketsRepository.findTicketByEnrollmentId(user.id);
  if (!ticket) throw new Error(JSON.stringify({ type: 'NOT_FOUND', message: 'Ticket not found' }));

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
