import express from 'express'
import mongoose from "mongoose";
import {mongooseOptions} from "./utils/Config.js";
import {getEnvironmentVariable, MONGODB_URL, NODE_ENV} from "./utils/Constants.js";
import userRouter from "./routers/UserRouter.js";
import foodEntryRouter from "./routers/FoodEntryRouter.js";
import adminRouter from "./routers/AdminRouter.js";
import {createAdminUser} from "./services/UserService.js";

await mongoose.connect(getEnvironmentVariable(MONGODB_URL),
    mongooseOptions[getEnvironmentVariable(NODE_ENV)])

const app = express()
app.use(express.json())

app.use(userRouter)
app.use(foodEntryRouter)
app.use(adminRouter)

await createAdminUser()

app.get('/ping', (req, res) => {
    res.status(200).send('pong')
})

app.listen(8080, () => {
    console.log("Listening on port 8080")
})