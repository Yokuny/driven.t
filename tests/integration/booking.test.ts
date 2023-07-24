import httpStatus from 'http-status';
import supertest from 'supertest';
import { Room, User } from '@prisma/client';
import {
  createEnrollmentWithAddress,
  createHotel,
  roomForHotel,
  roomHotelPersonalized,
  createTicket,
  ticketTypeRemote,
  ticketTypeForHotel,
  generateRoom,
  createUser,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import bookingService from '@/services/booking-service';
import { notFoundError } from '@/errors';

const server = supertest(app);

beforeAll(async () => await init());
beforeAll(async () => {
  await cleanDb();
  userWithRemoteTicket.user = await createUser();
  const enrollment = await createEnrollmentWithAddress(userWithRemoteTicket.user);
  const ticketType = await ticketTypeRemote();
  await createTicket(enrollment.id, ticketType.id, 'PAID');

  const hotel = await createHotel();
  userWithRemoteTicket.room = await roomForHotel(hotel.id);
  userWithNoEnrollment.user = await createUser();
});

describe('POST /booking', () => {
  const getAuthToken = async (user: User) => {
    const token = await generateValidToken(user);
    return `Bearer ${token}`;
  };

  it('should return 401 when no token is provided', async () => {
    const { status } = await server.post('/booking');
    expect(status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should return 403 when ticket is remote', async () => {
    const { user, room } = userWithRemoteTicket;
    const body = { roomId: room.id };
    const token = await getAuthToken(user);

    const { status } = await server.post('/booking').set('Authorization', token).send(body);

    expect(status).toBe(httpStatus.FORBIDDEN);
  });

  it('should receive NotFoundError', async () => {
    const { user } = userWithRemoteTicket;

    try {
      await bookingService.makeReservation(user.id, 1);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toEqual(notFoundError());
    }
  });

  it('should receive NoRoomSpaceError', async () => {
    const { user, room } = userWithRemoteTicket;

    try {
      const response = await bookingService.makeReservation(user.id, room.id);
      expect(response).toEqual({ bookingId: expect.any(Number) });
    } catch (error) {
      expect(error.message).toEqual('NoRoomSpaceError');
    }
  });

  it('should respond with status 404 when user has no enrollment', async () => {
    const body = { roomId: 3 };

    const { user } = userWithNoEnrollment;
    const token = await getAuthToken(user);
    const { status } = await server.post('/booking').set('Authorization', token).send(body);

    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 200 and roomId', async () => {
    const { user } = userWithNoEnrollment;
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await ticketTypeForHotel();
    await createTicket(enrollment.id, ticketType.id, 'PAID');

    const hotel = await createHotel();
    const room = await roomForHotel(hotel.id);
    const field = { roomId: room.id };

    const token = await getAuthToken(user);
    const { status, body } = await server.post('/booking').set('Authorization', token).send(field);

    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual({
      bookingId: expect.any(Number),
    });
  });
});

describe('PUT /booking/:bookingId', () => {
  const getAuthToken = async (user: User) => {
    const token = await generateValidToken(user);
    return `Bearer ${token}`;
  };

  it('should respond with status 401 if no token is given', async () => {
    const { status } = await server.put('/booking/1');
    expect(status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should return NotFoundError', async () => {
    try {
      const response = await bookingService.makeReservation(1, 2);
      expect(response).toEqual(1);
    } catch (error) {
      expect(error).toEqual(notFoundError());
    }
  });

  it('should return 403 when user has not made a reserve before', async () => {
    const { user } = userWithRemoteTicket;

    const hotel = await createHotel();
    const secondRoom = await roomForHotel(hotel.id);

    const token = await getAuthToken(user);
    const { status } = await server
      .put(`/booking/${1}`)
      .send({ roomId: secondRoom.id })
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.FORBIDDEN);
  });

  it('should return 403 when user has not made a reserve before', async () => {
    const { user } = userWithRemoteTicket;

    const hotel = await createHotel();
    const secondRoom = await roomHotelPersonalized(hotel.id, 1);

    const token = await getAuthToken(user);
    const { status } = await server
      .put(`/booking/${1}`)
      .send({ roomId: secondRoom.id })
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.FORBIDDEN);
  });

  it('should return 403 when new room has no vacancy', async () => {
    const { user, room } = userWithRemoteTicket;
    const secondRoom = await roomHotelPersonalized(room.hotelId, 0);
    const booking = await generateRoom(user.id, room.id);

    const token = await getAuthToken(user);
    const { status } = await server
      .put(`/booking/${booking.id}`)
      .send({ roomId: secondRoom.id })
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.FORBIDDEN);
  });

  it('should return 404 when new room does not exist', async () => {
    const { user, room } = userWithRemoteTicket;
    const booking = await generateRoom(user.id, room.id);

    const token = await getAuthToken(user);
    const { status } = await server
      .put(`/booking/${booking.id}`)
      .send({ roomId: 9 })
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it('should return 403 when bookingId is not sent', async () => {
    const { user } = userWithRemoteTicket;
    const secondRoom = await roomForHotel(userWithRemoteTicket.room.hotelId);

    const token = await getAuthToken(user);
    const { status } = await server
      .put(`/booking/r`)
      .send({ roomId: secondRoom.id })
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.FORBIDDEN);
  });

  it('should return 200 and bookingId', async () => {
    const { user } = userWithRemoteTicket;

    const hotel = await createHotel();
    const roomTwo = await roomForHotel(hotel.id);
    const booking = await generateRoom(user.id, userWithRemoteTicket.room.id);

    const token = await getAuthToken(user);
    const { status, body } = await server
      .put(`/booking/${booking.id}`)
      .send({ roomId: roomTwo.id })
      .set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual({
      bookingId: expect.any(Number),
    });
  });
});

interface UserWithRemoteTicket {
  user: User;
  room: Room;
}
interface UserWithNoEnrollment {
  user: User;
}

const userWithRemoteTicket: UserWithRemoteTicket = {
  user: null,
  room: null,
};
const userWithNoEnrollment: UserWithNoEnrollment = {
  user: null,
};
