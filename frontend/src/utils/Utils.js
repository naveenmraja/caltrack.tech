export async function getErrorResponse(response) {
    let errorMessage = `Error Occurred : HTTP ${response.status} ${response.statusText}`
    if (response.status === 400) {
        const responseJson = await response.json()
        errorMessage = responseJson.message
    }
    return {errorMessage: errorMessage, statusCode: response.status}
}

export function getAllowedYears() {
    const date = new Date()
    const currentYear = date.getFullYear()
    let years = []
    for (let year = 2000; year <= currentYear; year++) {
        years.push({value: year, label: `${year}`})
    }
    return years
}

const numberToMonth = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December"
}

export function getMonthFromNumber(month) {
    return numberToMonth[month]
}

export function getMonths() {
    let months = []
    for (let month = 0; month <= 11; month++) {
        months.push({value: month + 1, label: getMonthFromNumber(month)})
    }
    return months
}

export function getCurrentYear() {
    return new Date().getFullYear()
}

export function getCurrentMonth() {
    return (new Date().getMonth() + 1)
}

export function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

export const prefixZero = (num) => {
    return (num < 10) ? `0${num}` : num
}

