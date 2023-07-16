import { Response } from 'express';
import httpStatus from 'http-status';
import hotelsService from '@/services/hotels-service';
import { AuthenticatedRequest } from '@/protocols';

const getHotels = async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req;
  try {
    const hotels = await hotelsService.getAllHotels(Number(userId));

    return res.status(httpStatus.OK).send(hotels);
  } catch (err) {
    console.log('>>>>>>>' + err.message);

    if (err.message === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (err.message === 'paymentError') {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if (err.message === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

const getRooms = async (req: AuthenticatedRequest, res: Response) => {
  const { hotelId } = req.params;
  const { userId } = req;

  try {
    const HotelRooms = await hotelsService.getHotelRooms(Number(userId), Number(hotelId));

    return res.status(httpStatus.OK).send(HotelRooms);
  } catch (err) {
    console.log('>>>>>>>' + err.message);

    if (err.message === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if (err.message === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export { getHotels, getRooms };
