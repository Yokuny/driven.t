import { Address, Enrollment } from '@prisma/client';
import { request } from '@/utils/request';
import { NoContentError, notFoundError } from '@/errors';
import addressRepository, { CreateAddressParams } from '@/repositories/address-repository';
import enrollmentRepository, { CreateEnrollmentParams } from '@/repositories/enrollment-repository';
import { exclude } from '@/utils/prisma-utils';

type AddressObj = {
  logradouro: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string;
  uf: string;
};

async function getAddressFromCEP(cep: string) {
  const { data } = await request.get(`${process.env.VIA_CEP_API}/${cep}/json/`);
  console.log(data);
  if (data?.erro || !data) {
    throw NoContentError();
  }

  const address: AddressObj = {
    logradouro: data.logradouro,
    complemento: data.complemento,
    bairro: data.bairro,
    cidade: data.localidade,
    uf: data.uf,
  };

  return address;
}

async function createOrUpdateEnrollmentWithAddress(params: CreateOrUpdateEnrollmentWithAddress) {
  const address = getAddressForUpsert(params.address);

  const formattedCEP = params.address.cep.replace(/-/g, '');
  const birthdayString = params.birthday.toString();
  const [year, month, day] = birthdayString.split('-');
  const birthdayFormatted = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  if (isNaN(birthdayFormatted.getTime())) {
    console.log('invalid date');
    return;
  }
  const body = {
    name: params.name,
    cpf: params.cpf,
    birthday: birthdayFormatted,
    phone: params.phone,
    userId: params.userId,
    address: {
      cep: formattedCEP,
      street: params.address.street,
      city: params.address.city,
      number: params.address.number,
      state: params.address.state,
      neighborhood: params.address.neighborhood,
      addressDetail: params.address.addressDetail,
    },
  };

  await getAddressFromCEP(address.cep);
  const enrollment = { ...exclude(params, 'address') };
  const newEnrollment = await enrollmentRepository.upsert(body.userId, enrollment, exclude(enrollment, 'userId'));

  console.log('newEnrollmenmt', newEnrollment);
  await addressRepository.upsert(newEnrollment.id, address, address);
}

// async function createOrUpdateEnrollmentWithAddress(params: CreateOrUpdateEnrollmentWithAddress) {
//   const address = getAddressForUpsert(params.address);

//   await getAddressFromCEP(params.address.cep);

//   const date = params.birthday.toString();
//   const [year, month, day] = date.split('-');

//   const dateFormate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

//   if (isNaN(dateFormate.getTime())) {
//     console.error('A data de aniversário é inválida.');
//     return;
//   }
//   const enrollment = { ...exclude(params, 'address') };
//   const newEnrollment = await enrollmentRepository.upsert(params.userId, enrollment, exclude(enrollment, 'userId'));

//   await addressRepository.upsert(newEnrollment.id, address, address);
// }

function getAddressForUpsert(address: CreateAddressParams) {
  return {
    ...address,
    ...(address?.addressDetail && { addressDetail: address.addressDetail }),
  };
}

export type CreateOrUpdateEnrollmentWithAddress = CreateEnrollmentParams & {
  address: CreateAddressParams;
};

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

type GetOneWithAddressByUserIdResult = Omit<Enrollment, 'userId' | 'createdAt' | 'updatedAt'>;

function getFirstAddress(firstAddress: Address): GetAddressResult {
  if (!firstAddress) return null;

  return exclude(firstAddress, 'createdAt', 'updatedAt', 'enrollmentId');
}

type GetAddressResult = Omit<Address, 'createdAt' | 'updatedAt' | 'enrollmentId'>;

const enrollmentsService = {
  getOneWithAddressByUserId,
  createOrUpdateEnrollmentWithAddress,
  getAddressFromCEP,
};

export default enrollmentsService;
