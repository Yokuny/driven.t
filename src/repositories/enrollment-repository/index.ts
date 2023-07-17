import { Enrollment } from '@prisma/client';
import { prisma } from '@/config';
import { CreateEnrollmentParams, UpdateEnrollmentParams } from '@/protocols';

async function findWithAddressByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
}

async function upsert(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
) {
  return prisma.enrollment.upsert({
    where: {
      userId,
    },
    create: createdEnrollment,
    update: updatedEnrollment,
  });
}

async function findById(enrollmentId: number): Promise<Enrollment> {
  return prisma.enrollment.findFirst({
    where: { id: enrollmentId },
  });
}

const enrollmentRepository = {
  findWithAddressByUserId,
  upsert,
  findById,
};

export default enrollmentRepository;
