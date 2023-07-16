import { Address } from '@prisma/client';
import { request } from '@/utils/request';
import { notFoundError } from '@/errors';
import addressRepository from '@/repositories/address-repository';
import {
  CreateOrUpdateEnrollmentWithAddress,
  AddressEnrollment,
  GetAddressResult,
  CreateAddressParams,
} from '@/protocols';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { exclude } from '@/utils/prisma-utils';

async function getAddressFromCEP(cep: string): Promise<AddressEnrollment> {
  const result = await request.get(`${process.env.VIA_CEP_API}/${cep}/json/`);

  if (!result.data || result.data.erro) {
    throw notFoundError();
  }

  const { bairro, localidade, uf, complemento, logradouro } = result.data;

  const address: AddressEnrollment = {
    bairro,
    cidade: localidade,
    uf,
    complemento,
    logradouro,
  };

  return address;
}

async function getOneWithAddressByUserId(userId: number) {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmentWithAddress) throw Error('NotFoundError');

  const address = Array.isArray(enrollmentWithAddress.Address)
    ? getFirstAddress(enrollmentWithAddress.Address[0])
    : getFirstAddress(enrollmentWithAddress.Address);

  return {
    ...exclude(enrollmentWithAddress, 'userId', 'createdAt', 'updatedAt', 'Address'),
    ...(!!address && { address }),
  };
}

function getFirstAddress(firstAddress: Address): GetAddressResult {
  if (!firstAddress) return null;

  return exclude(firstAddress, 'createdAt', 'updatedAt', 'enrollmentId');
}

async function createOrUpdateEnrollmentWithAddress(params: CreateOrUpdateEnrollmentWithAddress) {
  const enrollment = exclude(params, 'address');
  const address = getAddressForUpsert(params.address);

  await getAddressFromCEP(address.cep);

  const newEnrollment = await enrollmentRepository.upsert(params.userId, enrollment, exclude(enrollment, 'userId'));

  await addressRepository.upsert(newEnrollment.id, address, address);
}

function getAddressForUpsert(address: CreateAddressParams) {
  return {
    ...address,
    ...(address?.addressDetail && { addressDetail: address.addressDetail }),
  };
}

const enrollmentsService = {
  getOneWithAddressByUserId,
  createOrUpdateEnrollmentWithAddress,
  getAddressFromCEP,
};

export default enrollmentsService;
