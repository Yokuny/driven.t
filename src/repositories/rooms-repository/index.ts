import { prisma } from '@/config';

const getRoom = (id: number) => {
  return prisma.room.findUnique({
    where: { id: id },
  });
};

const deleteRoom = (id: number) => {
  return prisma.room.delete({
    where: {
      id: id,
    },
  });
};

const roomRepository = {
  getRoom,
  deleteRoom,
};
export default roomRepository;
