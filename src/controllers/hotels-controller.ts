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
    if (err.type === 'BAD_REQUEST') {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (err.name === 'NotFoundError') {
      res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
};

const getRooms = async (req: AuthenticatedRequest, res: Response) => {
  const { hotelId } = req.params;
  const { userId } = req;

  try {
    const HotelRooms = await hotelsService.getHotelRooms(Number(userId), Number(hotelId));

    res.status(httpStatus.OK).send(HotelRooms);
  } catch (err) {
    if (err.name === 'UnauthorizedError') {
      res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if (err.name === 'NotFoundError') {
      res.sendStatus(httpStatus.NOT_FOUND);
    }
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
};

export { getHotels, getRooms };
