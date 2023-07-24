import Joi from 'joi';

export const bookingObj = Joi.object({
  roomId: Joi.number().required(),
});
