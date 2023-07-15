import dayjs from 'dayjs';
import { notFoundError } from '@/errors';
import eventRepository from '@/repositories/event-repository';
import { exclude } from '@/utils/prisma-utils';
import { GetFirstEventResult } from '@/protocols';

async function getFirstEvent(): Promise<GetFirstEventResult> {
  const event = await eventRepository.findFirst();
  if (!event) throw notFoundError();

  return exclude(event, 'createdAt', 'updatedAt');
}

async function isCurrentEventActive(): Promise<boolean> {
  const event = await eventRepository.findFirst();
  if (!event) return false;

  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);

  return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
}

const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
};

export default eventsService;
