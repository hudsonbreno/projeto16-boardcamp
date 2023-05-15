import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middlewares.js";
import { idsRentalSchema } from "../schemas/rentals.schema.js";
import { deleteRental, getRentals, postFinalByIdRentals, postRentals } from "../controllers/rentals.controller.js";

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRentals)
rentalsRouter.post("/rentals", validateSchema(idsRentalSchema), postRentals)
rentalsRouter.post("/rentals/:id/return", postFinalByIdRentals)
rentalsRouter.delete("/rentals/:id", deleteRental)

export default rentalsRouter