import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { duplicatedEmailError } from './errors';
import eventsService from '@/services/events-service';
import userRepository from '@/repositories/user-repository';
import { cannotEnrollBeforeStartDateError } from '@/errors';
import { CreateUserParams } from '@/protocols';

async function createUser({ email, password }: CreateUserParams): Promise<User> {
  await canEnrollOrFail();

  await validateUniqueEmailOrFail(email);

  const hashedPassword = await bcrypt.hash(password, 12);
  return userRepository.create({
    email,
    password: hashedPassword,
  });
}

async function validateUniqueEmailOrFail(email: string) {
  const userWithSameEmail = await userRepository.findByEmail(email);
  if (userWithSameEmail) {
    throw duplicatedEmailError();
  }
}

async function canEnrollOrFail() {
  const canEnroll = await eventsService.isCurrentEventActive();
  if (!canEnroll) {
    throw cannotEnrollBeforeStartDateError();
  }
}

const userService = {
  createUser,
};

export default userService;
