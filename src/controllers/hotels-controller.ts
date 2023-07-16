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
      return res.status(httpStatus.BAD_REQUEST).send(err);
    }
    if (err.message === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(err);
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
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
      return res.status(httpStatus.PAYMENT_REQUIRED).send(err);
    }
    if (err.message === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(err);
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
};

export { getHotels, getRooms };
