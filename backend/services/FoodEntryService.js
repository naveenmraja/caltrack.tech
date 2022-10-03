import {FoodEntry} from "../models/FoodEntry.js";
import {CREATE_FOOD_ENTRY, prefixZero, UPDATE_FOOD_ENTRY} from "../utils/Constants.js";
import {nanoid} from "nanoid/async";

export async function createOrUpdateFoodEntry(request, command) {
    let foodEntry
    if (command === CREATE_FOOD_ENTRY) {
        const id = `entry_${await nanoid()}`
        const foodEntryDocument = {
            id: id,
            food: request.body.food,
            consumptionDate: request.body.consumptionDate,
            consumptionTime: request.body.consumptionTime ? request.body.consumptionTime : null,
            calories: request.body.calories,
            username: request.params.username
        }
        foodEntry = await FoodEntry.create(foodEntryDocument)
    } else if (command === UPDATE_FOOD_ENTRY) {
        const id = request.body.id
        foodEntry = await getFoodEntryById(id)
        foodEntry.food = request.body.food
        foodEntry.consumptionDate = request.body.consumptionDate
        foodEntry.consumptionTime = request.body.consumptionTime ? request.body.consumptionTime : null
        foodEntry.calories = request.body.calories
        foodEntry.username = request.params.username
        foodEntry = await foodEntry.save()
    }
    return foodEntry
}

export async function getFoodEntryById(id) {
    return await FoodEntry.findOne({id}).exec()
}

export async function deleteFoodEntry(request) {
    await FoodEntry.deleteOne({id: request.params.id})
}

export async function deleteFoodEntries(request) {
    await FoodEntry.deleteMany({username: request.params.username})
}

function buildQuery(request) {
    const username = request.params.username
    let query = {username}
    if (request.query.startDate && request.query.endDate) {
        query['consumptionDate'] = {
            $gte: request.query.startDate,
            $lte: request.query.endDate
        }
    }
    return query
}

export async function listFoodEntriesByDate(request, user) {
    const calorieLimit = user.calorieLimit
    const skip = request.query.skip ? parseInt(request.query.skip) : 0
    const limit = request.query.limit ? parseInt(request.query.limit) : 10
    let query = buildQuery(request)
    return await FoodEntry.aggregate([
        {$match: query},
        {
            $group: {
                _id: "$consumptionDate", entries: {
                    $push: {
                        id: "$id",
                        food: "$food",
                        calories: "$calories",
                        consumptionDate: "$consumptionDate",
                        consumptionTime: "$consumptionTime",
                        createdAt: "$createdAt",
                        updatedAt: "$updatedAt"
                    }
                }
            }
        },
        {$sort: {"_id": -1}},
        {$skip: skip},
        {$limit: limit},
        {
            $project: {
                _id: 0,
                date: "$_id",
                totalCalories: {$sum: "$entries.calories"},
                limitExceeded: {
                    $cond: {if: {$gt: [{$sum: "$entries.calories"}, calorieLimit]}, then: true, else: false}
                },
                entries: "$entries"
            }
        }
    ])
}

export async function getFoodEntriesByDateMetrics(request) {
    let query = buildQuery(request)
    const result = await FoodEntry.aggregate([
        {$match: query},
        {$group: {_id: "$consumptionDate", calories: {$sum: "$calories"}}},
        {
            $group: {
                _id: null,
                count: {$sum: 1},
                totalCalories: {$sum: "$calories"},
                averageCalories: {$avg: "$calories"}
            }
        }
    ])
    return result.length > 0 ? result[0] : {count: 0, totalCalories: 0, averageCalories: 0}
}

export async function countCurrentWeekEntries() {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)
    const endDate = new Date()
    const query = {
        createdAt: {
            $gt: startDate,
            $lte: endDate
        }
    }
    return await FoodEntry.countDocuments(query)
}

export async function countLastWeekEntries() {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 14)
    const endDate = new Date()
    endDate.setDate(endDate.getDate() - 7)
    const query = {
        createdAt: {
            $gt: startDate,
            $lte: endDate
        }
    }
    return await FoodEntry.countDocuments(query)
}

export async function currentWeekAverageCalories() {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)
    const endDate = new Date()
    const query = {
        createdAt: {
            $gt: startDate,
            $lte: endDate
        }
    }
    const aggregateResult = await FoodEntry.aggregate([
        {$match: query},
        {
            $group: {
                _id: "$username",
                totalCalories: {$sum: "$calories"}
            }
        },
        {
            $group: {
                _id: "_id",
                avgCalories: {$avg: "$totalCalories"}
            }
        },
        {
            $project: {
                _id: 0,
                avgCalories: "$avgCalories"
            }
        }
    ])
    return aggregateResult.length > 0 ? aggregateResult[0].avgCalories : 0
}

export async function countFoodEntries(request) {
    let query = {}
    if (request.query.startDate && request.query.endDate) {
        query['consumptionDate'] = {
            $gte: request.query.startDate,
            $lte: request.query.endDate
        }
    }
    const result = await FoodEntry.aggregate([
        {$match: query},
        {$count: "count"},
    ])
    return result.length > 0 ? result[0].count : 0
}

export async function listFoodEntries(request) {
    const skip = request.query.skip ? parseInt(request.query.skip) : 0
    const limit = request.query.limit ? parseInt(request.query.limit) : 10
    let query = {}
    if (request.query.startDate && request.query.endDate) {
        query['consumptionDate'] = {
            $gte: request.query.startDate,
            $lte: request.query.endDate
        }
    }
    return await FoodEntry.aggregate([
        {$match: query},
        {$sort: {"consumptionDate": -1, "consumptionTime": 1}},
        {$skip: skip},
        {$limit: limit},
        {
            $project: {
                _id: 0,
                id: "$id",
                food: "$food",
                calories: "$calories",
                consumptionDate: "$consumptionDate",
                consumptionTime: "$consumptionTime",
                username: "$username",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt"
            }
        }
    ])
}