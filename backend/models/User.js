import mongoose from "mongoose"
import {DEFAULT_USER_CALORIE_LIMIT, UserRoles} from "../utils/Constants.js";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    calorieLimit: {
        type: Number,
        default: DEFAULT_USER_CALORIE_LIMIT
    },
    role: {
        type: String,
        enum: [UserRoles.User, UserRoles.Admin],
        default: UserRoles.User
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret._id
            delete ret.password
            delete ret.__v
        }
    }
})

export const User = new mongoose.model('users', userSchema)