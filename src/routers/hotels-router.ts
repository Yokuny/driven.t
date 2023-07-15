import { Router } from 'express';
import { getHotels, getRooms } from '../controllers/hotels-controller';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getHotels).get('/:hotelId', getRooms);

export { hotelsRouter };
