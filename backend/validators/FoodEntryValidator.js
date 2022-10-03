import {check, query, validationResult} from "express-validator";
import {UPDATE_FOOD_ENTRY, UserRoles} from "../utils/Constants.js";
import {getFoodEntryById} from "../services/FoodEntryService.js";
import {getUserByUsername} from "../services/UserService.js";

export async function validateCreateOrUpdateFoodEntryRequest(request, command) {
    await check('food').exists().withMessage("Missing field : food")
        .notEmpty().withMessage("Empty field : food").isAlpha('en-US', {ignore: ' '}).withMessage("Invalid field : food").run(request)
    await check('calories').exists().withMessage("Missing field : calories")
        .notEmpty().withMessage("Empty field : calories").isInt({min: 0})
        .withMessage("Invalid field : calories").run(request)
    await check('username').exists().withMessage("Missing field : username")
        .notEmpty().withMessage("Empty field : username").custom(async (username, {req}) => {
            if (!(req.user.role === UserRoles.Admin) && req.params.username !== req.user.username)
                return Promise.reject("Invalid username")
            if (req.user.role === UserRoles.Admin && req.params.username !== req.user.username) {
                const user = await getUserByUsername(req.params.username)
                if (!user)
                    return Promise.reject("Invalid username")
            }
        }).run(request)
    await check('consumptionDate').exists().withMessage("Missing field : consumptionDate")
        .notEmpty().withMessage("Empty field : consumptionDate")
        .isDate().withMessage("Invalid date. Accepted formats : [YYYY/MM/DD, YYYY-MM-DD]")
        .isBefore(new Date().toString()).withMessage("Invalid date. Cannot add entries for future dates")
        .run(request)
    await check('consumptionTime').custom(async (consumptionTime) => {
        if (consumptionTime) {
            if (consumptionTime.split(":").length !== 2) {
                return Promise.reject("Invalid consumptionTime. Accepted Format : HH:MM")
            }
            const [hours, minutes] = consumptionTime.split(":")
            if (isNaN(parseInt(hours)) || parseInt(hours) < 0 || parseInt(hours) > 23)
                return Promise.reject("Invalid consumptionTime. Hours should be between 0 and 23")
            if (isNaN(parseInt(minutes)) || parseInt(minutes) < 0 || parseInt(minutes) > 59)
                return Promise.reject("Invalid consumptionTime. Minutes should be between 0 and 59")
        }
        return true
    }).run(request)
    if (command === UPDATE_FOOD_ENTRY) {
        await check('id').exists().withMessage("Missing field : id")
            .notEmpty().withMessage("Empty field : id").custom(async (id, {req}) => {
                const foodEntry = await getFoodEntryById(id)
                if (foodEntry && (foodEntry.username === req.user.username || req.user.role === UserRoles.Admin))
                    return true
                else
                    return Promise.reject("Invalid id")
            }).run(request)
    }
    return validationResult(request)
}

export async function validateGetOrDeleteFoodEntryRequest(request) {
    await check('id').exists().withMessage("Missing field : id")
        .notEmpty().withMessage("Empty field : id").custom(async (id, {req}) => {
            const foodEntry = await getFoodEntryById(id)
            if (foodEntry && (foodEntry.username === req.user.username || req.user.role === UserRoles.Admin))
                return true
            else
                return Promise.reject("Invalid id")
        }).run(request)
    return validationResult(request)
}

export async function validateDeleteFoodEntriesRequest(request) {
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

export async function validateListFoodEntriesRequest(request) {
    await check('username').custom(async (username, {req}) => {
        if (!(req.user.role === UserRoles.Admin) && !username)
            return Promise.reject("Username missing")
        if (!(req.user.role === UserRoles.Admin) && req.params.username !== req.user.username)
            return Promise.reject("Invalid username")
        return true
    }).run(request)
    await check('startDate').if(query('startDate').exists()).isDate()
        .withMessage("Invalid date field : startDate. Accepted formats : [YYYY/MM/DD, YYYY-MM-DD]")
        .custom(async (startDate, {req}) => {
            if (req.query.endDate) {
                if (new Date(req.query.endDate) < new Date(startDate))
                    return Promise.reject("Invalid date range")
            } else {
                return Promise.reject("Missing field : endDate")
            }
            return true
        }).run(request)
    await check('endDate').if(query('endDate').exists()).isDate()
        .withMessage("Invalid date field : endDate. Accepted formats : [YYYY/MM/DD, YYYY-MM-DD]")
        .custom(async (endDate, {req}) => {
            if (req.query.startDate) {
                if (new Date(req.query.startDate) > new Date(endDate))
                    return Promise.reject("Invalid date range")
            } else {
                return Promise.reject("Missing field : startDate")
            }
            return true
        }).run(request)
    await check('skip').if(query('skip').exists()).isInt()
        .withMessage("Invalid field : skip").run(request)
    await check('limit').if(query('limit').exists()).isInt({max: 100})
        .withMessage("Invalid field : limit. Maximum accepted value : 100").run(request)
    return validationResult(request)
}