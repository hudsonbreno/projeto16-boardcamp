import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middlewares.js";
import { clientSchema } from "../schemas/client.schema.js"; 
import { getClients, getClientById, postClient, updateClient } from "../controllers/client.controller.js";

const clientRouter = Router()

clientRouter.get("/customers", getClients)
clientRouter.get("/customers/:id", getClientById)
clientRouter.post("/customers", validateSchema(clientSchema), postClient)
clientRouter.post("/customers/:id", validateSchema(clientSchema), updateClient)

export default clientRouter