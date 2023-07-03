import { Router } from 'express';
import { authenticateToken, validateBody, validateQuery } from '@/middlewares';
import { getEnrollmentByUser, postCreateOrUpdateEnrollment, getAddressFromCEP } from '@/controllers';
import { createOrUpdateEnrollmentSchema, cepSchema } from '@/schemas';

const enrollmentsRouter = Router();

enrollmentsRouter
  .get('/cep', validateQuery(cepSchema), getAddressFromCEP)
  .get('/cep', getAddressFromCEP)
  .all('/*', authenticateToken)
  .get('/', getEnrollmentByUser)
  .post('/', validateBody(createOrUpdateEnrollmentSchema), postCreateOrUpdateEnrollment);

export { enrollmentsRouter };
