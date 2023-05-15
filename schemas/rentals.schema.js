import joi from "joi";

export const idsRentalSchema = joi.object({
  daysRented: joi.number().positive().required(),
  customerId: joi.number().positive().required(),
  gameId: joi.number().positive().required()
})
