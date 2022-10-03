import mongoose from "mongoose"

const foodEntrySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    food: {
        type: String,
        required: true
    },
    consumptionDate: {
        type: String,
        required: true,
        index: true
    },
    consumptionTime: {
        type: String,
        required: true,
        index: true
    },
    calories: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true,
        index: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret._id
            delete ret.__v
        }
    }
})

foodEntrySchema.index({"createdAt": -1})

export const FoodEntry = new mongoose.model('food_entries', foodEntrySchema)