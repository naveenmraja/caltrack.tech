export const JWT_ACCESS_TOKEN_SECRET_KEY = "JWT_ACCESS_TOKEN_SECRET_KEY"
export const JWT_REFRESH_TOKEN_SECRET_KEY = "JWT_REFRESH_TOKEN_SECRET_KEY"
export const USER_ACCESS_TOKEN_DEFAULT_EXPIRY_IN_DAYS = 1
export const USER_ACCESS_TOKEN_EXTENDED_EXPIRY_IN_DAYS = 7
export const USER_REFRESH_TOKEN_EXPIRY_IN_DAYS = 30
export const MONGODB_URL = "MONGODB_URL"
export const NODE_ENV = "NODE_ENV"
export const PRODUCTION = "production"
export const ADMIN_USERNAME = "ADMIN_USERNAME"
export const ADMIN_PASSWORD = "ADMIN_PASSWORD"
export const ADMIN_EMAIL = "ADMIN_EMAIL"
export const NODEMAILER_EMAIL = "NODEMAILER_EMAIL"
export const NODEMAILER_PASSWORD = "NODEMAILER_PASSWORD"
export const UserRoles = {
    User: "user",
    Admin: "admin"
}
export const STATUS_FAILURE = "FAILURE"
export const CREATE_USER = "CREATE_USER"
export const UPDATE_USER = "UPDATE_USER"
export const CREATE_FOOD_ENTRY = "CREATE_FOOD_ENTRY"
export const UPDATE_FOOD_ENTRY = "UPDATE_FOOD_ENTRY"
export const SALT_ROUNDS = 8
export const DEFAULT_USER_CALORIE_LIMIT = 2100

export const prefixZero = (num) => {
    return (num < 10) ? `0${num}` : num
}

export function getEnvironmentVariable(name) {
    return process.env[name]
}