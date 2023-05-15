import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middlewares.js";
import { gameSchema } from "../schemas/game.schema.js";
import { getGames, postGames } from "../controllers/games.controller.js"

const gamesRouter = Router()

gamesRouter.get("/games", getGames)
gamesRouter.post("/games", validateSchema(gameSchema), postGames)

export default gamesRouter