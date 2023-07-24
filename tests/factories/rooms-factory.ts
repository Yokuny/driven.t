import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

export async function generateRoom(userId: number, roomId: number): Promise<Booking> {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
      updatedAt: new Date(),
    },
  });
}

export async function roomForHotel(hotelId: number): Promise<Room> {
  return prisma.room.create({
    data: {
      name: 'quarto A17',
      capacity: 4,
      hotelId: hotelId,
    },
  });
}

export async function roomHotelPersonalized(hotelId: number, capacity: number): Promise<Room> {
  return prisma.room.create({
    data: {
      name: 'Quarto Espacial',
      capacity,
      hotelId: hotelId,
    },
  });
}
