import ticketService from '../tickets-service';
import bookingRepository from '@/repositories/booking-repository';
import roomsRepository from '@/repositories/rooms-repository';
import { notFoundError } from '@/errors';

const userReservation = async (id: number) => {
  const reservation = await bookingRepository.userReservation(id);
  if (!reservation) throw notFoundError();

  return {
    id: reservation.id,
    Room: reservation.Room,
  };
};

const makeReservation = async (userId: number, roomId: number) => {
  const ticket = await ticketService.getTicketByUserId(userId);
  const validTicket =
    !ticket || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote || ticket.status === 'RESERVED';
  if (validTicket) throw Error('NoRoomSpaceError');

  const room = await roomsRepository.getRoom(roomId);
  if (!room) throw Error('NoRoomSpaceError');

  const roomSpace = await bookingRepository.roomSpace(roomId);
  if (room.capacity === roomSpace) Error('NoRoomSpaceError');

  const reservation = await bookingRepository.makeReservation(userId, roomId);
  return reservation.id;
};

const changeReservation = async (userId: number, bookingId: number, roomId: number) => {
  const reserve = await bookingRepository.userReservation(userId);
  if (!reserve) throw Error('NoRoomSpaceError');

  const room = await roomsRepository.getRoom(roomId);
  if (!room) throw notFoundError();

  const roomSpace = await bookingRepository.roomSpace(roomId);
  if (room.capacity === roomSpace) throw Error('NoRoomSpaceError');

  const reservation = await bookingRepository.findReservation(bookingId);
  if (!reservation) throw notFoundError();

  const actualRoom = await bookingRepository.editReservation(reservation.id, room.id);
  if (reservation.id !== actualRoom.id || !actualRoom) throw Error();

  return { bookingId: actualRoom.id };
};
const bookingService = {
  userReservation,
  makeReservation,
  changeReservation,
};

export default bookingService;
