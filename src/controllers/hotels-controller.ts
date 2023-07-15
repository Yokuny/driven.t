import { Response } from 'express';
import httpStatus from 'http-status';
import hotelsService from '@/services/hotels-service';
import { AuthenticatedRequest } from '@/middlewares';

const getHotels = async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req;

  try {
    const hotels = hotelsService.getAllHotels(Number(userId));
    res.status(httpStatus.OK).send(hotels);
  } catch (err) {
    if (err.type === 'BAD_REQUEST') {
      res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (err.type === 'NOT_FOUND') {
      res.sendStatus(httpStatus.NOT_FOUND);
    }
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
};

const getRooms = async (req: AuthenticatedRequest, res: Response) => {
  const { hotelId } = req.params;
  const { userId } = req;

  try {
    const HotelRooms = await hotelsService.getHotelRooms(Number(userId), Number(hotelId));

    res.status(httpStatus.OK).send(HotelRooms);
  } catch (err) {
    if (err.type === 'BAD_REQUEST') {
      res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (err.type === 'NOT_FOUND') {
      res.sendStatus(httpStatus.NOT_FOUND);
    }
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
};

export { getHotels, getRooms };
