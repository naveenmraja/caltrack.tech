import Loader from "../components/Loader";
import {Avatar, Container, IconButton, InputAdornment, Snackbar, TextField, Typography} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import {Badge, Email, Fastfood, Key, Person, Settings, Visibility, VisibilityOff} from "@mui/icons-material";
import {LoadingButton} from "@mui/lab";
import {useContext, useEffect, useState} from "react";
import UserContext, {
    CONFIRM_PASSWORD_ERROR,
    INVALID_CALORIE_LIMIT,
    INVALID_EMAIL,
    INVALID_NAME,
    INVALID_PASSWORD
} from "../utils/Constants";
import {getAccessToken, getUser, updateUser} from "../utils/APIDispatcher";
import {getErrorResponse} from "../utils/Utils";
import isStrongPassword from "validator/es/lib/isStrongPassword";
import isEmail from "validator/es/lib/isEmail";
import isAlpha from "validator/es/lib/isAlpha";
import isInt from "validator/es/lib/isInt";
import {Navigate} from "react-router-dom";

function SettingsView(props) {
    const {authenticated, setAuthenticated, authDetails, setUserDetails} = useContext(UserContext)
    const [name, setName] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [email, setEmail] = useState("")
    const [calorieLimit, setCalorieLimit] = useState("")
    const [nameError, setNameError] = useState("")
    const [newPasswordError, setNewPasswordError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [calorieLimitError, setCalorieLimitError] = useState("")
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("")
    const [currentPasswordError, setCurrentPasswordError] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [showLoader, setShowLoader] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)

    async function fetchUser() {
        const response = await getUser(authDetails.username, authDetails.accessToken)
        if (response.ok) {
            const responseJson = await response.json()
            setCalorieLimit(responseJson.calorieLimit)
            setEmail(responseJson.email)
            setName(responseJson.name)
            setUserDetails(responseJson)
        } else {
            const errorResponse = await getErrorResponse(response)
            if (errorResponse.statusCode === 401) {
                setAuthenticated(false)
            } else {
                setErrorMessage(errorResponse.errorMessage)
            }
        }
    }

    const clearErrors = () => {
        setErrorMessage("")
        setNameError("")
        setNewPasswordError("")
        setConfirmNewPasswordError("")
        setCurrentPasswordError("")
        setEmailError("")
        setCalorieLimitError("")
    }

    const updateUserDetails = async (event) => {
        event.preventDefault()
        clearErrors()
        setShowLoader(true)
        if ((newPassword && !isStrongPassword(newPassword))) {
            setNewPasswordError(INVALID_PASSWORD)
        } else if (newPassword !== confirmNewPassword) {
            setConfirmNewPasswordError(CONFIRM_PASSWORD_ERROR)
        } else if (!isEmail(email)) {
            setEmailError(INVALID_EMAIL)
        } else if (name.length < 1 || !isAlpha(name, 'en-US', {ignore: ' '})) {
            setNameError(INVALID_NAME)
        } else if (!currentPassword || (currentPassword && !isStrongPassword(currentPassword))) {
            setCurrentPasswordError(INVALID_PASSWORD)
        } else if (!calorieLimit || !isInt(calorieLimit.toString(), {min: 500, max: 3500})) {
            setCalorieLimitError(INVALID_CALORIE_LIMIT)
        } else {
            const params = {
                username: authDetails.username,
                password: currentPassword
            }
            const response = await getAccessToken(params)
            if (response.ok) {
                const password = newPassword ? newPassword : currentPassword
                const params = {
                    username: authDetails.username,
                    password: password,
                    calorieLimit: calorieLimit,
                    email: email,
                    name: name
                }
                const updateUserResponse = await updateUser(params, authDetails.accessToken)
                if (updateUserResponse.ok) {
                    setCurrentPassword("")
                    setShowSuccessSnackbar(true)
                    fetchUser()
                } else {
                    const errorResponse = await getErrorResponse(updateUserResponse)
                    if (errorResponse.statusCode === 401) {
                        setAuthenticated(false)
                    } else {
                        setErrorMessage(errorResponse.errorMessage)
                        setShowSnackbar(true)
                    }
                }
            } else {
                setErrorMessage("Invalid password. Please try again !")
                setShowSnackbar(true)
            }
        }
        setShowLoader(false)
    }

    useEffect(() => {
        fetchUser()
    }, [])

    if (!authenticated) {
        return (<Navigate to={"/"}/>)
    }

    return (
        <Container component="main" maxWidth="xs">
            <Loader showLoader={props.showLoader}/>
            <Snackbar open={showSnackbar} autoHideDuration={5000} onClose={() => setShowSnackbar(false)}>
                <MuiAlert elevation={6} variant="filled" onClose={() => setShowSnackbar(false)} severity="error"
                          sx={{width: '100%'}}>
                    {errorMessage}
                </MuiAlert>
            </Snackbar>
            <Snackbar open={showSuccessSnackbar} autoHideDuration={5000} onClose={() => setShowSuccessSnackbar(false)}>
                <MuiAlert elevation={6} variant="filled" onClose={() => setShowSuccessSnackbar(false)}
                          severity="success" sx={{width: '100%'}}>
                    Profile updated successfully !
                </MuiAlert>
            </Snackbar>
            <Box
                sx={{
                    marginTop: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <Settings/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Settings
                </Typography>
                <Box component="form" noValidate sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Username"
                        autoComplete="username"
                        disabled
                        placeholder={"Username"}
                        color={"secondary"}
                        size={"small"}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person color={"secondary"}/>
                                </InputAdornment>
                            )
                        }}
                        value={authDetails.username}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        autoFocus
                        label="New Password"
                        type={showNewPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder={"New Password"}
                        color={"secondary"}
                        size={"small"}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Key color={"secondary"}/>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    {showNewPassword ? (
                                        <IconButton onClick={() => setShowNewPassword(false)}>
                                            <VisibilityOff/>
                                        </IconButton>
                                    ) : (
                                        <IconButton onClick={() => setShowNewPassword(true)}>
                                            <Visibility/>
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            )
                        }}
                        value={newPassword}
                        error={newPasswordError.length > 0}
                        helperText={newPasswordError}
                        onChange={(event) => setNewPassword(event.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Confirm New Password"
                        type={showConfirmNewPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder={"Confirm New Password"}
                        color={"secondary"}
                        size={"small"}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Key color={"secondary"}/>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    {showConfirmNewPassword ? (
                                        <IconButton onClick={() => setShowConfirmNewPassword(false)}>
                                            <VisibilityOff/>
                                        </IconButton>
                                    ) : (
                                        <IconButton onClick={() => setShowConfirmNewPassword(true)}>
                                            <Visibility/>
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            )
                        }}
                        value={confirmNewPassword}
                        error={confirmNewPasswordError.length > 0}
                        helperText={confirmNewPasswordError}
                        onChange={(event) => setConfirmNewPassword(event.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        autoComplete="email"
                        placeholder={"Email"}
                        color={"secondary"}
                        size={"small"}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email color={"secondary"}/>
                                </InputAdornment>
                            )
                        }}
                        value={email}
                        error={emailError.length > 0}
                        helperText={emailError}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Full name"
                        autoComplete="name"
                        placeholder={"Full Name"}
                        color={"secondary"}
                        size={"small"}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Badge color={"secondary"}/>
                                </InputAdornment>
                            )
                        }}
                        value={name}
                        error={nameError.length > 0}
                        helperText={nameError}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Calorie Limit"
                        autoComplete="name"
                        placeholder={"Calorie Limit"}
                        color={"secondary"}
                        size={"small"}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Fastfood color={"secondary"}/>
                                </InputAdornment>
                            )
                        }}
                        value={calorieLimit}
                        error={calorieLimitError.length > 0}
                        helperText={calorieLimitError}
                        onChange={(event) => setCalorieLimit(event.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Current Password"
                        type={showCurrentPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder={"Confirm Current Password"}
                        color={"secondary"}
                        size={"small"}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Key color={"secondary"}/>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    {showCurrentPassword ? (
                                        <IconButton onClick={() => setShowCurrentPassword(false)}>
                                            <VisibilityOff/>
                                        </IconButton>
                                    ) : (
                                        <IconButton onClick={() => setShowCurrentPassword(true)}>
                                            <Visibility/>
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            )
                        }}
                        value={currentPassword}
                        error={currentPasswordError.length > 0}
                        helperText={currentPasswordError}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                    />
                    <LoadingButton
                        fullWidth
                        onClick={updateUserDetails}
                        loading={showLoader}
                        loadingPosition="end"
                        variant="contained"
                        type="submit"
                        sx={{mt: 3, mb: 2}}
                    >
                        {showLoader ? "Updating details. Please wait..." : "Update"}
                    </LoadingButton>
                </Box>
            </Box>
        </Container>
    )
}

export default SettingsView