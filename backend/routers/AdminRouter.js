import express from "express";
import {authenticateAdmin, authenticateUser, handleDeleteUser} from "../controllers/UserController.js";
import {deleteFoodEntries, listFoodEntries} from "../controllers/FoodEntryController.js";
import {getMetrics} from "../controllers/AdminController.js";

const adminRouter = express.Router()

adminRouter.get('/admin/metrics', authenticateUser, authenticateAdmin, getMetrics)
adminRouter.get('/admin/food-entries', authenticateUser, authenticateAdmin, listFoodEntries)
adminRouter.delete('/users/:username', authenticateUser, authenticateAdmin, handleDeleteUser)
adminRouter.delete('/users/:username/food-entries', authenticateUser, authenticateAdmin, deleteFoodEntries)

export default adminRouter
