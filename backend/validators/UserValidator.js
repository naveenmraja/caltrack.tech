import {CREATE_USER, UPDATE_USER, UserRoles} from "../utils/Constants.js";
import {check, validationResult} from "express-validator";
import {getUserByEmail, getUserByUsername} from "../services/UserService.js";

export async function validateGetAccessTokenRequest(request) {
    await check('username').exists().withMessage("Missing field : username")
        .notEmpty().withMessage("Empty field : username")
        .isLength({min: 6}).withMessage("Username must be minimum 6 characters in length")
        .isAlphanumeric('en-US', {ignore: '_-.@'}).withMessage("Username can only contain letters, numbers or [.-_@]")
        .run(request)
    await check('password').exists().withMessage("Missing field : password")
        .notEmpty().withMessage("Empty field : password")
        .isStrongPassword().withMessage("Invalid username or password").run(request)
    return validationResult(request)
}

export async function validateGetUserRequest(request) {
    await check('username').exists().withMessage("Missing field : username")
        .notEmpty().withMessage("Empty field : username")
        .isLength({min: 6}).withMessage("Username must be minimum 6 characters in length")
        .isAlphanumeric('en-US', {ignore: '_-.@'}).withMessage("Username can only contain letters, numbers or [.-_@]")
        .bail()
        .custom(async (username, {req}) => {
            if (username !== req.user.username && !(req.user.role === UserRoles.Admin)) {
                return Promise.reject("Invalid username")
            }
            const user = await getUserByUsername(username)
            if (!user)
                Promise.reject("Invalid username")
        }).run(request)
    return validationResult(request)
}

export async function validateInviteFriendRequest(request) {
    await check('name').exists().withMessage("Missing field : name")
        .notEmpty().withMessage("Empty field : name").isAlpha('en-US', {ignore: ' '})
        .withMessage("Invalid Name").run(request)
    await check('email').exists().withMessage("Email not present")
        .isEmail().withMessage("Invalid Email").bail().normalizeEmail()
        .custom(async (email) => {
            const user = await getUserByEmail(email)
            return user ? Promise.reject("Email already registered with another user") : true
        }).withMessage("Email already registered with another user").run(request)
    return validationResult(request)
}

export async function validateDeleteUserRequest(request) {
    await check('username').exists().withMessage("Missing field : username")
        .notEmpty().withMessage("Empty field : username")
        .isLength({min: 6}).withMessage("Username must be minimum 6 characters in length")
        .isAlphanumeric('en-US', {ignore: '_-.@'}).withMessage("Username can only contain letters, numbers or [.-_@]")
        .bail()
        .custom(async (username) => {
            const user = await getUserByUsername(username)
            return user ? true : Promise.reject("Invalid username")
        }).run(request)
    return validationResult(request)
}

export async function validateCreateOrUpdateUserRequest(request, command) {

    await check('name').exists().withMessage("Missing field : name")
        .notEmpty().withMessage("Empty field : name").isAlpha('en-US', {ignore: ' '})
        .withMessage("Invalid Name").run(request)
    await check('calorieLimit').exists().withMessage("Missing field : calorieLimit")
        .notEmpty().withMessage("Empty field : calorieLimit").isInt({min: 500, max: 3500})
        .withMessage("Calorie limit should be between 500 and 3500").run(request)

    if (command === CREATE_USER) {
        await check('password').exists().withMessage("Missing field : password")
            .notEmpty().withMessage("Empty field : password")
            .isStrongPassword().withMessage("Password policy mismatch").run(request)
    } else if (command === UPDATE_USER && request.body.password) {
        await check('password').isStrongPassword().withMessage("Password policy mismatch").run(request)
    }

    const usernameCheck = await check('username').exists().withMessage("Missing field : username")
        .notEmpty().withMessage("Empty field : username")
        .isLength({min: 6}).withMessage("Username must be minimum 6 characters in length")
        .isAlphanumeric('en-US', {ignore: '_-.@'}).withMessage("Username can only contain letters, numbers or [.-_@]")
        .bail()
        .custom(async (username, {req}) => {
            if (command === UPDATE_USER && username !== req.user.username && !(req.user.role === UserRoles.Admin)) {
                return Promise.reject("username is not allowed to update")
            }
            const user = await getUserByUsername(username)
            if (command === CREATE_USER) {
                return user ? Promise.reject("Username already exists") : true
            } else if (command === UPDATE_USER) {
                return user ? true : Promise.reject("Invalid username")
            }
        }).run(request, {dryRun: true})

    if (usernameCheck.isEmpty()) {
        await check('email').exists().withMessage("Email not present")
            .isEmail().withMessage("Invalid Email").bail().normalizeEmail()
            .custom(async (email, {req}) => {
                const user = await getUserByEmail(email)
                if (command === CREATE_USER) {
                    return user ? Promise.reject("Email already registered with another user") : true
                } else if (command === UPDATE_USER) {
                    return (user && user.username !== req.body.username) ?
                        Promise.reject("Email already registered with another user") : true
                }
            }).withMessage("Email already registered with another user").run(request)
    } else {
        return usernameCheck
    }
    return validationResult(request)
}