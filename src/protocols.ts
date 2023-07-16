import { Payment, Ticket, Enrollment, Address, Event, User } from '@prisma/client';
import { Request } from 'express';

export type ApplicationError = {
  name: string;
  message: string;
};

export type ViaCEPAddress = {
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
};

export type ViaCEPAddressError = {
  error: boolean;
};

export type ViaCEPAddressResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
};

export type AddressEnrollment = {
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  error?: string;
};

export type RequestError = {
  status: number;
  data: object | null;
  statusText: string;
  name: string;
  message: string;
};

export type CreateTicketParams = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

export type CardPaymentParams = {
  issuer: string;
  number: number;
  name: string;
  expirationDate: Date;
  cvv: number;
};

export type PaymentParams = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

export type InputTicketBody = {
  ticketTypeId: number;
};

//para enrolment service
export type GetOneWithAddressByUserIdResult = Omit<Enrollment, 'userId' | 'createdAt' | 'updatedAt'>;

export type GetAddressResult = Omit<Address, 'createdAt' | 'updatedAt' | 'enrollmentId'>;

export type CreateOrUpdateEnrollmentWithAddress = CreateEnrollmentParams & {
  address: CreateAddressParams;
};

//para ticket service
export type CreateEnrollmentParams = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, 'userId'>;

//para address service
export type CreateAddressParams = Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'enrollmentId'>;
export type UpdateAddressParams = CreateAddressParams;

//event service
export type GetFirstEventResult = Omit<Event, 'createdAt' | 'updatedAt'>;

//authentication service
export type SignInParams = Pick<User, 'email' | 'password'>;

export type SignInResult = {
  user: Pick<User, 'id' | 'email'>;
  token: string;
};

export type GetUserOrFailResult = Pick<User, 'id' | 'email' | 'password'>;

//user service
export type CreateUserParams = Pick<User, 'email' | 'password'>;

//auth middleware
export type AuthenticatedRequest = Request & JWTPayload;

export type JWTPayload = {
  userId: number;
};

export type AddressOrAddressArray = Address | Address[];
