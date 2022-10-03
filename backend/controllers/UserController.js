import {
    validateCreateOrUpdateUserRequest,
    validateDeleteUserRequest,
    validateGetAccessTokenRequest,
    validateGetUserRequest,
    validateInviteFriendRequest
} from "../validators/UserValidator.js";
import {
    CREATE_USER,
    getEnvironmentVariable,
    JWT_ACCESS_TOKEN_SECRET_KEY,
    JWT_REFRESH_TOKEN_SECRET_KEY,
    STATUS_FAILURE,
    UPDATE_USER,
    USER_ACCESS_TOKEN_DEFAULT_EXPIRY_IN_DAYS,
    USER_ACCESS_TOKEN_EXTENDED_EXPIRY_IN_DAYS,
    USER_REFRESH_TOKEN_EXPIRY_IN_DAYS,
    UserRoles
} from "../utils/Constants.js";
import {
    createOrUpdateUser,
    createUserAndSendInvitation,
    deleteUser,
    getUserByUsername,
    verifyAndGetUser
} from "../services/UserService.js";
import jsonwebtoken from "jsonwebtoken";

export async function handleCreateOrUpdateUser(request, response, command) {
    try {
        const validationResult = await validateCreateOrUpdateUserRequest(request, command)
        if (!validationResult.isEmpty()) {
            return response.status(400).json({
                status: STATUS_FAILURE,
                message: validationResult.array()[0].msg
            })
        }
        const user = await createOrUpdateUser(request, command)
        return response.status(200).json(user.toJSON())
    } catch (e) {
        console.log(`Error occurred in ${command} API : ${e.message}`)
        const responseBody = {status: STATUS_FAILURE, message: e.message}
        return response.status(500).json(responseBody)
    }
}

export async function createUser(request, response) {
    return handleCreateOrUpdateUser(request, response, CREATE_USER)
}

export async function updateUser(request, response) {
    return handleCreateOrUpdateUser(request, response, UPDATE_USER)
}

export async function getUser(request, response) {
    try {
        const validationResult = await validateGetUserRequest(request)
        if (!validationResult.isEmpty()) {
            return response.status(400).json({
                status: STATUS_FAILURE,
                message: validationResult.array()[0].msg
            })
        }
        const user = await getUserByUsername(request.params.username)
        return response.status(200).json(user.toJSON())
    } catch (e) {
        console.log(`Error occurred in getUser API : ${e.message}`)
        const responseBody = {status: STATUS_FAILURE, message: e.message}
        return response.status(500).json(responseBody)
    }
}

function tokenizePayload(payload, extendedExpiry = true) {
    let accessTokenExpiry = new Date()
    accessTokenExpiry.setDate(accessTokenExpiry.getDate() + (extendedExpiry ? USER_ACCESS_TOKEN_EXTENDED_EXPIRY_IN_DAYS :
        USER_ACCESS_TOKEN_DEFAULT_EXPIRY_IN_DAYS))
    let refreshTokenExpiry = new Date()
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + USER_REFRESH_TOKEN_EXPIRY_IN_DAYS)
    const accessTokenSecretKey = getEnvironmentVariable(JWT_ACCESS_TOKEN_SECRET_KEY)
    const refreshTokenSecretKey = getEnvironmentVariable(JWT_REFRESH_TOKEN_SECRET_KEY)
    const token = jsonwebtoken.sign(payload, accessTokenSecretKey, {
        expiresIn: extendedExpiry ? `${USER_ACCESS_TOKEN_EXTENDED_EXPIRY_IN_DAYS}d` : `${USER_ACCESS_TOKEN_DEFAULT_EXPIRY_IN_DAYS}d`
    })
    const refreshToken = jsonwebtoken.sign(payload, refreshTokenSecretKey, {
        expiresIn: `${USER_REFRESH_TOKEN_EXPIRY_IN_DAYS}d`
    })
    return {
        username: payload.username,
        role: payload.role,
        accessToken: token,
        accessTokenExpiry: accessTokenExpiry.getTime(),
        refreshToken: refreshToken,
        refreshTokenExpiry: refreshTokenExpiry.getTime()
    }
}

export async function getAccessToken(request, response) {
    try {
        const validationResult = await validateGetAccessTokenRequest(request)
        if (!validationResult.isEmpty()) {
            return response.status(400).json({
                status: STATUS_FAILURE,
                message: validationResult.array()[0].msg
            })
        }
        const username = request.body.username
        const password = request.body.password
        const user = await verifyAndGetUser(username, password)
        if (user) {
            const payload = {
                username: username,
                role: user.role
            }
            const responseBody = tokenizePayload(payload, request.body.rememberMe)
            return response.status(200).json(responseBody)
        } else {
            console.log(`User login failed for ${username}`)
            const responseBody = {status: STATUS_FAILURE, message: "Invalid username or password"}
            return response.status(400).json(responseBody)
        }
    } catch (e) {
        console.log(`Error occurred in getAccessToken API : ${e.message}`)
        const responseBody = {status: STATUS_FAILURE, message: e.message}
        return response.status(500).json(responseBody)
    }
}

export function authenticateUser(request, response, next) {
    try {
        const authHeader = request.headers.authorization
        if (authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7, authHeader.length)
            const accessTokenSecretKey = getEnvironmentVariable(JWT_ACCESS_TOKEN_SECRET_KEY)
            request.user = jsonwebtoken.verify(token, accessTokenSecretKey)
            next()
        } else {
            return response.status(401).json({status: STATUS_FAILURE, message: "Unauthenticated resource access"})
        }
    } catch (e) {
        return response.status(401).json({status: STATUS_FAILURE, message: "Unauthenticated resource access"})
    }
}

export function authenticateAdmin(request, response, next) {
    if (request.user && request.user.role === UserRoles.Admin)
        next()
    else
        return response.status(401).json({status: STATUS_FAILURE, message: "Unauthenticated resource access"})
}

export async function refreshAccessToken(request, response) {
    try {
        const refreshToken = request.body.refreshToken
        const refreshTokenSecretKey = getEnvironmentVariable(JWT_REFRESH_TOKEN_SECRET_KEY)
        const payload = jsonwebtoken.verify(refreshToken, refreshTokenSecretKey)
        if (payload.username === request.user.username) {
            delete payload.exp
            delete payload.iat
            const responseBody = tokenizePayload(payload)
            return response.status(200).json(responseBody)
        } else {
            return response.status(400).json({status: STATUS_FAILURE, message: "Invalid refresh token"})
        }
    } catch (e) {
        return response.status(400).json({status: STATUS_FAILURE, message: "Invalid refresh token"})
    }
}

export async function handleDeleteUser(request, response) {
    try {
        const validationResult = await validateDeleteUserRequest(request)
        if (!validationResult.isEmpty()) {
            return response.status(400).json({
                status: STATUS_FAILURE,
                message: validationResult.array()[0].msg
            })
        }
        await deleteUser(request)
        return response.status(204).send()
    } catch (e) {
        console.log(`Error occurred in in deleteUser API : ${e.message}`)
        const responseBody = {status: STATUS_FAILURE, message: e.message}
        return response.status(500).json(responseBody)
    }
}

export async function inviteFriend(request, response) {
    try {
        const validationResult = await validateInviteFriendRequest(request)
        if (!validationResult.isEmpty()) {
            return response.status(400).json({
                status: STATUS_FAILURE,
                message: validationResult.array()[0].msg
            })
        }
        await createUserAndSendInvitation(request)
        return response.status(204).send()
    } catch (e) {
        console.log(`Error occurred in in inviteFriend API : ${e.message}`)
        const responseBody = {status: STATUS_FAILURE, message: e.message}
        return response.status(500).json(responseBody)
    }
}