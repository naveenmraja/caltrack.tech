import {CREATE_FOOD_ENTRY, STATUS_FAILURE, UPDATE_FOOD_ENTRY} from "../utils/Constants.js";
import {
    validateCreateOrUpdateFoodEntryRequest,
    validateDeleteFoodEntriesRequest,
    validateGetOrDeleteFoodEntryRequest,
    validateListFoodEntriesRequest
} from "../validators/FoodEntryValidator.js";
import * as FoodEntryService from "../services/FoodEntryService.js";
import {getUserByUsername} from "../services/UserService.js";

export async function handleCreateOrUpdateFoodEntry(request, response, command) {
    try {
        const validationResult = await validateCreateOrUpdateFoodEntryRequest(request, command)
        if (!validationResult.isEmpty()) {
            return response.status(400).json({
                status: STATUS_FAILURE,
                message: validationResult.array()[0].msg
            })
        }
        const foodEntry = await FoodEntryService.createOrUpdateFoodEntry(request, command)
        return response.status(200).json(foodEntry.toJSON())
    } catch (e) {
        console.log(`Error occurred in ${command} API : ${e.message}`)
        const responseBody = {status: STATUS_FAILURE, message: e.message}
        return response.status(500).json(responseBody)
    }
}

export async function getFoodEntry(request, response) {
    try {
        const validationResult = await validateGetOrDeleteFoodEntryRequest(request)
        if (!validationResult.isEmpty()) {
            return response.status(400).json({
                status: STATUS_FAILURE,
                message: validationResult.array()[0].msg
            })
        }
        const foodEntry = await FoodEntryService.getFoodEntryById(request.params.id)
        return response.status(200).json(foodEntry.toJSON())
    } catch (e) {
        console.log(`Error occurred in getFoodEntry API : ${e.message}`)
        const responseBody = {status: STATUS_FAILURE, message: e.message}
        return response.status(500).json(responseBody)
    }
}

export async function deleteFoodEntry(request, response) {
    try {
        const validationResult = await validateGetOrDeleteFoodEntryRequest(request)
        if (!validationResult.isEmpty()) {
            return response.status(400).json({
                status: STATUS_FAILURE,
                message: validationResult.array()[0].msg
            })
        }
        await FoodEntryService.deleteFoodEntry(request)
        return response.status(204).send()
    } catch (e) {
        console.log(`Error occurred in deleteFoodEntry API : ${e.message}`)
        const responseBody = {status: STATUS_FAILURE, message: e.message}
        return response.status(500).json(responseBody)
    }
}

export async function deleteFoodEntries(request, response) {
    try {
        const validationResult = await validateDeleteFoodEntriesRequest(request)
        if (!validationResult.isEmpty()) {
            return response.status(400).json({
                status: STATUS_FAILURE,
                message: validationResult.array()[0].msg
            })
        }
        await FoodEntryService.deleteFoodEntries(request)
        return response.status(204).send()
    } catch (e) {
        console.log(`Error occurred in deleteFoodEntry API : ${e.message}`)
        const responseBody = {status: STATUS_FAILURE, message: e.message}
        return response.status(500).json(responseBody)
    }
}

export async function createFoodEntry(request, response) {
    return handleCreateOrUpdateFoodEntry(request, response, CREATE_FOOD_ENTRY)
}

export async function updateFoodEntry(request, response) {
    return handleCreateOrUpdateFoodEntry(request, response, UPDATE_FOOD_ENTRY)
}

export async function listFoodEntriesByDate(request, response) {
    try {
        const validationResult = await validateListFoodEntriesRequest(request)
        if (!validationResult.isEmpty()) {
            return response.status(400).json({
                status: STATUS_FAILURE,
                message: validationResult.array()[0].msg
            })
        }
        const user = await getUserByUsername(request.params.username)
        const foodEntriesMetrics = await FoodEntryService.getFoodEntriesByDateMetrics(request)
        const foodEntries = await FoodEntryService.listFoodEntriesByDate(request, user)
        const responseBody = {
            total: foodEntriesMetrics.count,
            skip: request.query.skip ? parseInt(request.query.skip) : 0,
            limit: request.query.limit ? parseInt(request.query.limit) : 10,
            count: foodEntries.length,
            username: request.params.username,
            calorieLimit: user.calorieLimit,
            totalCalories: foodEntriesMetrics.totalCalories,
            averageCalories: Math.floor(foodEntriesMetrics.averageCalories * 100) / 100,
            data: foodEntries
        }
        return response.status(200).json(responseBody)
    } catch (e) {
        console.log(`Error occurred in listFoodEntriesByDate API : ${e.message}`)
        const responseBody = {status: STATUS_FAILURE, message: e.message}
        return response.status(500).json(responseBody)
    }
}

export async function listFoodEntries(request, response) {
    try {
        const validationResult = await validateListFoodEntriesRequest(request)
        if (!validationResult.isEmpty()) {
            return response.status(400).json({
                status: STATUS_FAILURE,
                message: validationResult.array()[0].msg
            })
        }
        const totalFoodEntries = await FoodEntryService.countFoodEntries(request)
        const foodEntries = await FoodEntryService.listFoodEntries(request)
        const responseBody = {
            total: totalFoodEntries,
            skip: request.query.skip ? parseInt(request.query.skip) : 0,
            limit: request.query.limit ? parseInt(request.query.limit) : 10,
            count: foodEntries.length,
            entries: foodEntries
        }
        return response.status(200).json(responseBody)
    } catch (e) {
        console.log(`Error occurred in listFoodEntries API : ${e.message}`)
        const responseBody = {status: STATUS_FAILURE, message: e.message}
        return response.status(500).json(responseBody)
    }
}

export async function listCalories(request, response) {
    try {
        const validationResult = await validateListFoodEntriesRequest(request)
        if (!validationResult.isEmpty()) {
            return response.status(400).json({
                status: STATUS_FAILURE,
                message: validationResult.array()[0].msg
            })
        }
    } catch (e) {

    }
}