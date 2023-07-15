import { Prisma, User } from '@prisma/client';
import { prisma } from '@/config';

async function findByEmail(email: string, select?: Prisma.UserSelect): Promise<User> {
  const params: Prisma.UserFindUniqueArgs = {
    where: {
      email,
    },
  };

  if (select) params.select = select;

  return prisma.user.findUnique(params);
}

async function create(data: Prisma.UserUncheckedCreateInput): Promise<User> {
  return prisma.user.create({
    data,
  });
}

const userRepository = {
  findByEmail,
  create,
};

export default userRepository;
