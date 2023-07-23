import { prisma } from '@/config';

const userBooking = async (id: number) => {
  return prisma.booking.findFirst({
    where: { id: id },
    include: { Room: true },
  });
};

const bookingRepository = {
  userBooking,
};

export default bookingRepository;
