import { prisma } from '@/config';

const userReservation = async (id: number) => {
  return prisma.booking.findFirst({
    where: { id: id },
    include: { Room: true },
  });
};

async function roomSpace(id: number) {
  return prisma.booking.count({
    where: { id },
  });
}

async function makeReservation(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
      updatedAt: new Date(),
    },
  });
}

async function editReservation(booking: number, room: number) {
  return prisma.booking.update({
    where: { id: booking },
    data: { roomId: room },
  });
}

async function findReservation(id: number) {
  return prisma.booking.findUnique({
    where: { id: id },
  });
}

const bookingRepository = {
  userReservation,
  roomSpace,
  makeReservation,
  editReservation,
  findReservation,
};

export default bookingRepository;
