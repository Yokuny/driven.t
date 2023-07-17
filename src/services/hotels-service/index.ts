import { Hotel } from '@prisma/client';
import enrollmentsService from '@/services/enrollments-service';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsService from '@/services/tickets-service';

const getAllHotels = async (userId: number): Promise<Hotel[]> => {
  const user = await enrollmentsService.getOneWithAddressByUserId(userId);
  if (!user) throw Error('NotFoundError');

  const ticket = await ticketsService.getTicketByUserId(userId);
  if (!ticket) throw Error('NotFoundError');
  if (ticket.status === 'RESERVED') throw Error('paymentError');

  const userTicket = await ticketsService.getTicketByUserId(userId);
  if (!userTicket.TicketType.includesHotel) throw Error('paymentError');
  if (userTicket.TicketType.isRemote === true) throw Error('paymentError');

  const hotels: Hotel[] = await hotelsRepository.getAllHotels();
  if (!hotels || hotels.length === 0) throw Error('NotFoundError');

  return hotels;
};

const getHotelRooms = async (userId: number, hotelId: number) => {
  if (!hotelId) throw Error('NotFoundError');

  const user = await enrollmentsService.getOneWithAddressByUserId(userId);
  if (!user) throw Error('NotFoundError');

  const ticket = await ticketsService.getTicketByUserId(userId);
  if (!ticket) throw Error('NotFoundError');
  if (ticket.status === 'RESERVED') throw Error('paymentError');

  const userTicket = await ticketsService.getTicketByUserId(userId);
  if (!userTicket.TicketType.includesHotel) throw Error('paymentError');
  if (userTicket.TicketType.isRemote === true) throw Error('paymentError');

  const hotelAndRooms = await hotelsRepository.getHotelRooms(hotelId);
  if (!hotelAndRooms) throw Error('NotFoundError');
  if (!hotelAndRooms.Rooms || hotelAndRooms.Rooms.length === 0) throw Error('NotFoundError');
  return hotelAndRooms;
};

const hotelsService = {
  getAllHotels,
  getHotelRooms,
};

export default hotelsService;
