import express from "express";
import {authenticateUser} from "../controllers/UserController.js";
import {
    createFoodEntry,
    deleteFoodEntry,
    getFoodEntry,
    listCalories,
    listFoodEntriesByDate,
    updateFoodEntry
} from "../controllers/FoodEntryController.js";

const foodEntryRouter = express.Router()

foodEntryRouter.post('/users/:username/food-entries', authenticateUser, createFoodEntry)
foodEntryRouter.put('/users/:username/food-entries', authenticateUser, updateFoodEntry)
foodEntryRouter.get('/users/:username/food-entries/:id', authenticateUser, getFoodEntry)
foodEntryRouter.delete('/users/:username/food-entries/:id', authenticateUser, deleteFoodEntry)
foodEntryRouter.get('/users/:username/food-entries', authenticateUser, listFoodEntriesByDate)
foodEntryRouter.get('/users/:username/calories', authenticateUser, listCalories)

export default foodEntryRouter;