import { Router } from 'express';
import { authenticateToken, validateBody, validateQuery } from '@/middlewares';
import { getEnrollmentByUser, postCreateOrUpdateEnrollment, getAddressFromCEP } from '@/controllers';
import { createEnrollmentSchema } from '@/schemas';

const enrollmentsRouter = Router();
// .get('/cep', validateQuery(cepSchema), getAddressFromCEP)

enrollmentsRouter
  .get('/cep', validateQuery(cepSchema), getAddressFromCEP)
  .all('/*', authenticateToken)
  .get('/', getEnrollmentByUser)
  .post('/', validateBody(createEnrollmentSchema), postCreateOrUpdateEnrollment);

export { enrollmentsRouter };
