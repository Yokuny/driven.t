import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import { createHotel } from '../factories/hotels-factory';
import {
  createEnrollmentWithAddress,
  createTicket,
  createTicketType,
  createTicketTypePersonalized,
  createUser,
} from '../factories';
import app, { init } from '@/app';

beforeEach(async () => await cleanDb());
beforeAll(async () => await init());

const server = supertest(app);

describe('GET /hotels', () => {
  it('responderia 200 com hoteis quando token é valido', async () => {
    const person = await createUser();
    const enrollment = await createEnrollmentWithAddress(person);
    const ticket = await createTicketTypePersonalized(false, true);
    await createTicket(enrollment.id, ticket.id, 'PAID');

    const hotel = await createHotel();
    const token = await generateValidToken(person);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body[0]).toEqual({
      id: hotel.id,
      name: hotel.name,
      image: hotel.image,
      createdAt: hotel.createdAt.toISOString(),
      updatedAt: hotel.updatedAt.toISOString(),
    });
  });

  it('responderia 401 quando token do usuario é invalido', async () => {
    const response = await server.get('/hotels');
    expect(response.status).toBe(401);
  });

  it('responderia 402 quando ticket não foi pago', async () => {
    const person = await createUser();
    const enrollment = await createEnrollmentWithAddress(person);
    const ticket = await createTicketType();
    await createTicket(enrollment.id, ticket.id, 'RESERVED');

    const token = await generateValidToken(person);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(402);
  });

  it('responderia 402 quando ticket é remoto', async () => {
    const person = await createUser();
    const enrollment = await createEnrollmentWithAddress(person);
    const ticket = await createTicketTypePersonalized(true, false);
    await createTicket(enrollment.id, ticket.id, 'PAID');

    const token = await generateValidToken(person);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(402);
  });

  it('responderia 402 quando ticket não inclui hotel', async () => {
    const person = await createUser();
    const enrollment = await createEnrollmentWithAddress(person);
    const ticket = await createTicketTypePersonalized(true, false);
    await createTicket(enrollment.id, ticket.id, 'PAID');

    const token = await generateValidToken(person);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(402);
  });

  it('responderia 404 se não existe enrollment ainda', async () => {
    const token = await generateValidToken(await createUser());
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('responderia 404 se não existe ticket ainda', async () => {
    const person = await createUser();
    await createEnrollmentWithAddress(person);

    const token = await generateValidToken(person);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(404);
  });

  it('responderia 404 quando não existe hoteis', async () => {
    const person = await createUser();
    const enrollment = await createEnrollmentWithAddress(person);
    const ticket = await createTicketTypePersonalized(false, true);
    await createTicket(enrollment.id, ticket.id, 'PAID');

    const token = await generateValidToken(person);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(404);
  });
});

describe('GET /hotels/:id', () => {
  it('responderia 401 quando token é invalido', async () => {
    const response = await server.get('/hotels/1');
    expect(response.status).toBe(401);
  });

  it('responderia 404 quando ainda não existe enrollment', async () => {
    const person = await createUser();

    const token = await generateValidToken(person);
    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
  });

  it('responderia 404 quando ticket não existir', async () => {
    const person = await createUser();
    await createEnrollmentWithAddress(person);

    const token = await generateValidToken(person);
    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(404);
  });

  it('responderia 404 quando não existir hoteis', async () => {
    const person = await createUser();
    const enrollment = await createEnrollmentWithAddress(person);
    const ticket = await createTicketTypePersonalized(false, true);
    await createTicket(enrollment.id, ticket.id, 'PAID');

    const token = await generateValidToken(person);
    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(404);
  });

  it('responderia 402 quanto ticket não está pago', async () => {
    const person = await createUser();
    const enrollment = await createEnrollmentWithAddress(person);
    const ticket = await createTicketType();
    await createTicket(enrollment.id, ticket.id, 'RESERVED');

    const token = await generateValidToken(person);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(402);
  });

  it('responderia 402 quando ticket for remoto', async () => {
    const person = await createUser();
    const enrollment = await createEnrollmentWithAddress(person);
    const ticket = await createTicketTypePersonalized(true, false);
    await createTicket(enrollment.id, ticket.id, 'PAID');

    const token = await generateValidToken(person);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(402);
  });

  it('responderia 402 quando ticket não inclui hotel', async () => {
    const person = await createUser();
    const enrollment = await createEnrollmentWithAddress(person);
    const ticket = await createTicketTypePersonalized(true, false);
    await createTicket(enrollment.id, ticket.id, 'PAID');

    const token = await generateValidToken(person);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(402);
  });
});
