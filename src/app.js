import express from "express";
import cors from "cors"
import router from "../routes/index.routes.js"


const app = express()
app.use(cors())
app.use(express.json())
app.use(router)

app.listen(process.env.PORT,()=> console.log(`Servidor funcionando na PORTA 5000 `)) //${process.env.PORT}

//process.env.PORT

////DATABASE_URL= postgres://postgres:root@localhost:5432/tastecamp
//                          ^      ^          ^    ^        ^
//                         user   senha   local  porta    nome do DB
