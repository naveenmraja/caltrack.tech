import express from "express";
import {
    authenticateUser,
    createUser,
    getAccessToken,
    getUser,
    inviteFriend,
    refreshAccessToken,
    updateUser
} from "../controllers/UserController.js";

const userRouter = express.Router()

userRouter.post('/users', createUser)
userRouter.put('/users', authenticateUser, updateUser)
userRouter.get('/users/:username', authenticateUser, getUser)
userRouter.post('/users/:username/invite-friend', authenticateUser, inviteFriend)
userRouter.post('/users/oauth2/tokens', getAccessToken)
userRouter.post('/users/oauth2/refresh', authenticateUser, refreshAccessToken)

export default userRouter;