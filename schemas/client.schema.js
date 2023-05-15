import joi from "joi"

export const clientSchema = joi.object({
    cpf: joi.string().pattern(/^[0-9]{11}$/).required(),
    phone: joi.string().min(10).max(11).required(),
    name: joi.string().required(),
    birthday: joi.date().iso().required()
})