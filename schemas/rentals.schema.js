import joi from "joi";

export const rentalSchema = joi.object({
  rentDate: joi.date().iso().required(),
  daysRented: joi.number().positive().required(),
  returnDate: joi.date().allow(null).required(),
  originalPrice: joi.number().positive().required(),
  delayFee: joi.date().allow(null).required()
})

export const idsRentalSchema = joi.object({
  daysRented: joi.number().positive().required(),
  customerId: joi.number().positive().required(),
  gameId: joi.number().positive().required()
})
