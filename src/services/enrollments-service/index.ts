import { Address } from '@prisma/client';
import { request } from '@/utils/request';
import { notFoundError } from '@/errors';
import addressRepository from '@/repositories/address-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { exclude } from '@/utils/prisma-utils';
import {
  AddressEnrollment,
  GetOneWithAddressByUserIdResult,
  GetAddressResult,
  CreateOrUpdateEnrollmentWithAddress,
  CreateAddressParams,
} from '@/protocols';

async function getAddressFromCEP(cep: string): Promise<AddressEnrollment> {
  const result = await request.get(`${process.env.VIA_CEP_API}/${cep}/json/`);

  if (!result.data || result.data.erro) throw notFoundError();

  const { bairro, localidade, uf, complemento, logradouro } = result.data;

  return {
    bairro,
    cidade: localidade,
    uf,
    complemento,
    logradouro,
  };
}

async function getOneWithAddressByUserId(userId: number): Promise<GetOneWithAddressByUserIdResult> {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmentWithAddress) throw notFoundError();

  const [firstAddress] = enrollmentWithAddress.Address;
  const address = getFirstAddress(firstAddress);

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
