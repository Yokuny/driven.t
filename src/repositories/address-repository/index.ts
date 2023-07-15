import { Address } from '@prisma/client';
import { prisma } from '@/config';
import { CreateAddressParams, UpdateAddressParams } from '@/protocols';

async function upsert(
  enrollmentId: number,
  createdAddress: CreateAddressParams,
  updatedAddress: UpdateAddressParams,
): Promise<Address> {
  return prisma.address.upsert({
    where: {
      enrollmentId,
    },
    create: {
      ...createdAddress,
      Enrollment: { connect: { id: enrollmentId } },
    },
    update: updatedAddress,
  });
}

const addressRepository = {
  upsert,
};

export default addressRepository;
