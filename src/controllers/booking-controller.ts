import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/protocols';
import bookingService from '@/services/booking-service';

export async function userBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const reservation = await bookingService.userBooking(Number(userId));
    return res.status(httpStatus.OK).send(reservation);
  } catch (error) {
    if (error.name === 'DuplicatedEmailError') {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}
