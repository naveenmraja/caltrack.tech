import {
    CREATE_FOOD_ENTRY_URL,
    CREATE_USER_URL,
    DELETE_ALL_FOOD_ENTRIES_URL,
    DELETE_FOOD_ENTRY_URL,
    DELETE_USER_URL,
    GET_ACCESS_TOKEN_URL,
    GET_ALL_FOOD_ENTRIES_URL,
    GET_FOOD_ENTRY_URL,
    GET_METRICS_URL,
    GET_USER_URL,
    HTTP_DELETE,
    HTTP_GET,
    HTTP_POST,
    HTTP_PUT,
    INVITE_FRIEND_URL,
    LIST_FOOD_ENTRIES_URL,
    REFRESH_ACCESS_TOKEN_URL,
    UPDATE_FOOD_ENTRY_URL,
    UPDATE_USER_URL
} from "./Constants";

export async function makeAPICall(url, method, params = null, accessToken = null) {
    const headers = {}
    if (accessToken) {
        headers["Authorization"] = "Bearer " + accessToken
    }
    if (method === HTTP_POST || method === HTTP_PUT) {
        headers["Content-Type"] = "application/json"
    }
    if (method === HTTP_GET) {
        if (params) {
            return await fetch(url + "?" + new URLSearchParams(params), {method: method, headers: headers})
        } else {
            return await fetch(url, {method: method, headers: headers})
        }
    } else {
        return await fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(params)
        })
    }
}

export async function createUser(params) {
    return await makeAPICall(CREATE_USER_URL, HTTP_POST, params)
}

export async function getUser(username, accessToken) {
    return await makeAPICall(GET_USER_URL.replace(":username", username), HTTP_GET, null, accessToken)
}

export async function updateUser(params, accessToken) {
    return await makeAPICall(UPDATE_USER_URL, HTTP_PUT, params, accessToken)
}

export async function getAccessToken(params) {
    return await makeAPICall(GET_ACCESS_TOKEN_URL, HTTP_POST, params)
}

export async function refreshAccessToken(params, accessToken) {
    return await makeAPICall(REFRESH_ACCESS_TOKEN_URL, HTTP_POST, params, accessToken)
}

export async function createFoodEntry(params, username, accessToken) {
    return await makeAPICall(CREATE_FOOD_ENTRY_URL.replace(":username", username),
        HTTP_POST, params, accessToken)
}

export async function updateFoodEntry(params, username, accessToken) {
    return await makeAPICall(UPDATE_FOOD_ENTRY_URL.replace(":username", username),
        HTTP_PUT, params, accessToken)
}

export async function getFoodEntry(username, entryId, accessToken) {
    return await makeAPICall(GET_FOOD_ENTRY_URL.replace(":username", username)
        .replace(":entryId", entryId), HTTP_GET, null, accessToken)
}

export async function deleteFoodEntry(username, entryId, accessToken) {
    return await makeAPICall(DELETE_FOOD_ENTRY_URL.replace(":username", username)
        .replace(":entryId", entryId), HTTP_DELETE, null, accessToken)
}

export async function listFoodEntriesByDate(params, username, accessToken) {
    return await makeAPICall(LIST_FOOD_ENTRIES_URL.replace(":username", username),
        HTTP_GET, params, accessToken)
}

export async function inviteFriend(params, username, accessToken) {
    return await makeAPICall(INVITE_FRIEND_URL.replace(":username", username),
        HTTP_POST, params, accessToken)
}

export async function deleteUser(username, accessToken) {
    return await makeAPICall(DELETE_USER_URL.replace(":username", username), HTTP_DELETE, null, accessToken)
}

export async function deleteAllFoodEntriesForUser(username, accessToken) {
    return await makeAPICall(DELETE_ALL_FOOD_ENTRIES_URL.replace(":username", username), HTTP_DELETE, null, accessToken)
}

export async function getMetrics(accessToken) {
    return await makeAPICall(GET_METRICS_URL, HTTP_GET, null, accessToken)
}

export async function getAllFoodEntries(params, accessToken) {
    return await makeAPICall(GET_ALL_FOOD_ENTRIES_URL, HTTP_GET, params, accessToken)
}