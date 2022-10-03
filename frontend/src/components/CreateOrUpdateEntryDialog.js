import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    TextField
} from "@mui/material";
import {Fastfood, Person, Scale} from "@mui/icons-material";
import {useContext, useState} from "react";
import {LoadingButton} from "@mui/lab";
import isNumeric from "validator/es/lib/isNumeric";
import isAlpha from "validator/es/lib/isAlpha";
import {createFoodEntry, updateFoodEntry} from "../utils/APIDispatcher";
import {getErrorResponse, prefixZero} from "../utils/Utils";
import MuiAlert from "@mui/material/Alert";
import isAlphanumeric from "validator/es/lib/isAlphanumeric";
import UserContext, {CREATE_ENTRY} from "../utils/Constants";

function CreateOrUpdateEntryDialog(props) {
    const {setAuthenticated, authDetails} = useContext(UserContext)
    const [username, setUsername] = useState(props.username ? props.username : "")
    const [food, setFood] = useState(props.food ? props.food : "")
    const [calories, setCalories] = useState(props.calories ? props.calories.toString() : "")
    const [consumptionTimeHour, setConsumptionTimeHour] = useState(props.consumptionTime ?
        props.consumptionTime.split(":")[0] : "")
    const [consumptionTimeMinutes, setConsumptionTimeMinutes] = useState(props.consumptionTime ?
        props.consumptionTime.split(":")[1] : "")
    const [showLoader, setShowLoader] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [foodError, setFoodError] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [caloriesError, setCaloriesError] = useState("")
    const [consumptionTimeHourError, setConsumptionTimeHourError] = useState("")
    const [consumptionTimeMinutesError, setConsumptionTimeMinutesError] = useState("")
    const [createOrUpdateEntryError, setCreateOrUpdateEntryError] = useState("")

    const date = `${props.date.getFullYear()}-${prefixZero(props.date.getMonth() + 1)}-${prefixZero(props.date.getDate())}`

    const clearErrors = () => {
        setUsernameError("")
        setFoodError("")
        setCaloriesError("")
        setConsumptionTimeHourError("")
        setConsumptionTimeMinutesError("")
        setCreateOrUpdateEntryError("")
    }

    const closeDialog = () => {
        if (props.admin)
            setUsername("")
        if (props.command === CREATE_ENTRY) {
            setFood("")
            setCalories("")
            setConsumptionTimeHour("")
            setConsumptionTimeMinutes("")
        }
        clearErrors()
        props.closeDialog()
    }

    const createOrUpdateEntry = async (event) => {
        event.preventDefault()
        clearErrors()
        if (props.admin && !username) {
            setUsernameError("Please enter a username")
        } else if (!food) {
            setFoodError("Please enter name of the food item")
        } else if (!calories) {
            setCaloriesError("Invalid enter a value")
        } else if (props.admin && (username.length < 6 || !isAlphanumeric(username, 'en-US', {ignore: ' -_@.'}))) {
            setUsernameError("Invalid username")
        } else if (!isAlpha(food, 'en-US', {ignore: ' '})) {
            setFoodError("Invalid input. Food name should only contain alphabets")
        } else if (!isNumeric(calories, {no_symbols: true})) {
            setCaloriesError("Invalid input. Calories should be a positive number")
        } else if (!consumptionTimeHour) {
            setConsumptionTimeHourError("Please select a value")
        } else if (!consumptionTimeMinutes) {
            setConsumptionTimeMinutesError("Please select a value")
        } else {
            setShowLoader(true)
            const consumptionTime = `${consumptionTimeHour}:${consumptionTimeMinutes}`
            const params = {
                food: food,
                calories: calories,
                consumptionDate: date,
                consumptionTime: consumptionTime
            }
            let response
            if (props.id) {
                params["id"] = props.id
                response = await updateFoodEntry(params, username, authDetails.accessToken)
            } else {
                response = await createFoodEntry(params, username, authDetails.accessToken)
            }
            if (response.ok) {
                closeDialog()
                props.handleSuccessEvent(props.command)
            } else {
                const errorResponse = await getErrorResponse(response)
                if (errorResponse.statusCode === 401) {
                    setAuthenticated(false)
                } else {
                    setCreateOrUpdateEntryError(errorResponse.errorMessage)
                    setShowSnackbar(true)
                }
            }
            setShowLoader(false)
        }
    }

    const hoursMenuItems = []
    const minutesMenuItems = []

    for (let i = 0; i < 24; i++)
        hoursMenuItems.push(<MenuItem value={prefixZero(i)} key={`hours-item-${i}`}>{prefixZero(i)}</MenuItem>)
    for (let i = 0; i < 60; i++)
        minutesMenuItems.push(<MenuItem value={prefixZero(i)} key={`minutes-item-${i}`}>{prefixZero(i)}</MenuItem>)

    return (
        <Dialog open={props.showDialog} onClose={closeDialog}>
            <Snackbar open={showSnackbar} autoHideDuration={5000} onClose={() => setShowSnackbar(false)}>
                <MuiAlert elevation={6} variant="filled" onClose={() => setShowSnackbar(false)} severity="error"
                          sx={{width: '100%'}}>
                    {createOrUpdateEntryError}
                </MuiAlert>
            </Snackbar>
            <DialogTitle>{props.command === CREATE_ENTRY ? "Creating" : "Updating"} entry for {date}</DialogTitle>
            <DialogContent>
                <Box component="form" noValidate>
                    {props.admin ? <TextField
                        autoFocus
                        margin="normal"
                        label="Username"
                        placeholder={"Username"}
                        color={"secondary"}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person color={"secondary"}/>
                                </InputAdornment>
                            )
                        }}
                        value={username}
                        error={usernameError.length > 0}
                        helperText={usernameError}
                        onChange={(event) => setUsername(event.target.value)}
                    /> : ""}
                    <TextField
                        autoFocus={!props.admin}
                        margin="normal"
                        label="Food"
                        placeholder={"Food"}
                        color={"secondary"}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Fastfood color={"secondary"}/>
                                </InputAdornment>
                            )
                        }}
                        value={food}
                        error={foodError.length > 0}
                        helperText={foodError}
                        onChange={(event) => setFood(event.target.value)}
                    />
                    <TextField
                        margin="normal"
                        label="Calories"
                        placeholder={"Calories"}
                        color={"secondary"}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Scale color={"secondary"}/>
                                </InputAdornment>
                            )
                        }}
                        value={calories}
                        error={caloriesError.length > 0}
                        helperText={caloriesError}
                        onChange={(event) => setCalories(event.target.value)}
                    />
                    <FormControl error={consumptionTimeHourError.length > 0} sx={{mr: 1, minWidth: 120}}
                                 color={"secondary"}>
                        <InputLabel>Hour</InputLabel>
                        <Select
                            value={consumptionTimeHour}
                            label="Hour"
                            onChange={(event) => setConsumptionTimeHour(event.target.value)}
                        >
                            {hoursMenuItems}
                        </Select>
                        <FormHelperText>{consumptionTimeHourError}</FormHelperText>
                    </FormControl>
                    <FormControl error={consumptionTimeMinutesError.length > 0} sx={{mr: 1, minWidth: 120}}
                                 color={"secondary"}>
                        <InputLabel>Minute</InputLabel>
                        <Select
                            value={consumptionTimeMinutes}
                            label="Minute"
                            onChange={(event) => setConsumptionTimeMinutes(event.target.value)}
                        >
                            {minutesMenuItems}
                        </Select>
                        <FormHelperText>{consumptionTimeHourError}</FormHelperText>
                    </FormControl>
                    <Stack direction={"row"} spacing={2} sx={{mt: 1}}>
                        <Button color={"secondary"} variant={"contained"} onClick={closeDialog} disabled={showLoader}>
                            Cancel
                        </Button>
                        <LoadingButton
                            fullWidth
                            onClick={createOrUpdateEntry}
                            loading={showLoader}
                            loadingPosition="end"
                            sx={{mt: 3, mb: 2}}
                            type="submit"
                            variant="contained">
                            {showLoader ? (props.command === CREATE_ENTRY ? "Creating Entry. Please wait..." : "Updating Etnry. Please wait...")
                                : (props.command === CREATE_ENTRY ? "Create Entry" : "Update Entry")}
                        </LoadingButton>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default CreateOrUpdateEntryDialog