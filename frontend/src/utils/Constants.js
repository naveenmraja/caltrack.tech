import {Paper, styled} from "@mui/material";
import React from 'react'

export const GET_ACCESS_TOKEN_URL = "/api/users/oauth2/tokens"
export const CREATE_USER_URL = "/api/users"
export const REFRESH_ACCESS_TOKEN_URL = "/api/users/oauth2/refresh"
export const GET_USER_URL = "/api/users/:username"
export const UPDATE_USER_URL = "/api/users"
export const CREATE_FOOD_ENTRY_URL = "/api/users/:username/food-entries"
export const UPDATE_FOOD_ENTRY_URL = "/api/users/:username/food-entries"
export const GET_FOOD_ENTRY_URL = "/api/users/:username/food-entries/:entryId"
export const DELETE_FOOD_ENTRY_URL = "/api/users/:username/food-entries/:entryId"
export const LIST_FOOD_ENTRIES_URL = "/api/users/:username/food-entries"
export const INVITE_FRIEND_URL = "/api/users/:username/invite-friend"
export const DELETE_USER_URL = "/api/users/:username"
export const DELETE_ALL_FOOD_ENTRIES_URL = "/api/users/:username/food-entries"
export const GET_METRICS_URL = "/api/admin/metrics"
export const GET_ALL_FOOD_ENTRIES_URL = "/api/admin/food-entries"

export const HTTP_GET = "GET"
export const HTTP_POST = "POST"
export const HTTP_PUT = "PUT"
export const HTTP_DELETE = "DELETE"

export const INVALID_USERNAME = "Invalid Username. Username should contain minimum 6 characters and should only be letters, numbers or [._-@]"
export const INVALID_NAME = "Invalid Name"
export const INVALID_PASSWORD = "Invalid Password. Password should contain minimum 8 characters with atleast 1 lowercase, 1 uppercase, 1 number and 1 symbol."
export const CONFIRM_PASSWORD_ERROR = "Passwords don't match"
export const INVALID_EMAIL = "Invalid Email"
export const INVALID_CALORIE_LIMIT = "Calorie limit should be a number between 500 and 3500"
export const NO_ENTRIES_MESSAGE = "No entries made during this period"
export const DEFAULT_CALORIE_LIMIT = 2100

export const AUTH_DETAILS = "AUTH_DETAILS"
export const CREATE_ENTRY = "create_entry"
export const UPDATE_ENTRY = "update_entry"
export const DELETE_ENTRY = "delete_entry"


export const UserRoles = {
    User: "user",
    Admin: "admin"
}

const UserContext = React.createContext({
    authenticated: false,
    authDetails: {},
    setAuthenticated: () => {
    },
    setAuthDetails: () => {
    }
})
export default UserContext

export const StyledPaper = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary
}))