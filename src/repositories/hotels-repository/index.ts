import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

function getAllHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

function getHotelRooms(id: number): Promise<Hotel & { Rooms: Room[] }> {
  return prisma.hotel.findUnique({
    where: {
      id,
    },
    include: {
      Rooms: true,
    },
  });
}

const hotelsRepository = {
  getAllHotels,
  getHotelRooms,
};

export default hotelsRepository;
