import { Event } from '@prisma/client';
import { prisma } from '@/config';

async function findFirst(): Promise<Event> {
  return prisma.event.findFirst();
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
