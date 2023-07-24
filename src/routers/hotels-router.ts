import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotels, getRooms } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getHotels).get('/:hotelId', getRooms);

export { hotelsRouter };
