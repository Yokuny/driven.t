import { ApplicationError } from '@/protocols';

export function NoContentError(): ApplicationError {
  return {
    name: 'NoContentError',
    message: 'No result for this search!',
  };
}
