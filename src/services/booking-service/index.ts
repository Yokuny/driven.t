import bookingRepository from '@/repositories/booking-repository';
import { notFoundError } from '@/errors';

const userBooking = async (id: number) => {
  const reservation = await bookingRepository.userBooking(id);
  if (!reservation) throw notFoundError();
  return reservation;
};

const bookingService = {
  userBooking,
};

export default bookingService;
