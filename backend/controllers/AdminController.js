import {
    countCurrentWeekEntries,
    countLastWeekEntries,
    currentWeekAverageCalories
} from "../services/FoodEntryService.js";
import {STATUS_FAILURE} from "../utils/Constants.js";

export async function getMetrics(request, response) {
    try {
        const currentWeekEntries = await countCurrentWeekEntries()
        const lastWeekEntries = await countLastWeekEntries()
        const currentWeekAverageCaloriesPerUser = await currentWeekAverageCalories()
        const responseBody = {
            currentWeekEntries,
            lastWeekEntries,
            currentWeekAverageCaloriesPerUser
        }
        return response.status(200).json(responseBody)
    } catch (e) {
        console.log(`Error occurred in getMetrics API : ${e.message}`)
        const responseBody = {status: STATUS_FAILURE, message: e.message}
        return response.status(500).json(responseBody)
    }
}