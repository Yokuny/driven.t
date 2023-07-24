import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/protocols';
import bookingService from '@/services/booking-service';

export async function userBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const reservation = await bookingService.userReservation(Number(userId));

    return res.status(httpStatus.OK).send(reservation);
  } catch (error) {
    if (error.message === 'DuplicatedEmailError') return res.status(httpStatus.CONFLICT).send(error);
    if (error.name === 'NotFoundError' || error.message === 'NotFoundError')
      return res.status(httpStatus.NOT_FOUND).send(error);
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function reserveRoom(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  try {
    const bookingId = await bookingService.makeReservation(Number(userId), Number(roomId));

    return res.status(httpStatus.OK).send({ bookingId });
  } catch (error) {
    if (error.message === 'NoRoomSpaceError') return res.sendStatus(httpStatus.FORBIDDEN);
    if (error.name === 'NotFoundError' || error.message === 'NotFoundError')
      return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function changeReserve(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  const { bookingId } = req.params;

  try {
    const room = await bookingService.changeReservation(Number(userId), Number(bookingId), Number(roomId));

    return res.status(httpStatus.OK).send(room);
  } catch (error) {
    if (error.message === 'NoRoomSpaceError') return res.sendStatus(httpStatus.FORBIDDEN);
    if (error.message === 'CannotListHotelsError') return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    if (error.name === 'NotFoundError' || error.message === 'NotFoundError')
      return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}