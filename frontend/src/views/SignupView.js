import {Avatar, Container, Grid, IconButton, InputAdornment, Snackbar, TextField, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Link from '@mui/material/Link';
import MuiAlert from "@mui/material/Alert";
import Loader from "../components/Loader";
import {Badge, Email, Key, LockOutlined, Person, Visibility, VisibilityOff} from "@mui/icons-material";
import * as React from "react";
import {useContext, useState} from "react";
import {LoadingButton} from "@mui/lab";
import isAlphanumeric from "validator/es/lib/isAlphanumeric";
import isStrongPassword from "validator/es/lib/isStrongPassword";
import UserContext, {
    AUTH_DETAILS,
    CONFIRM_PASSWORD_ERROR,
    DEFAULT_CALORIE_LIMIT,
    INVALID_EMAIL,
    INVALID_NAME,
    INVALID_PASSWORD,
    INVALID_USERNAME
} from "../utils/Constants";
import isEmail from "validator/es/lib/isEmail";
import isAlpha from "validator/es/lib/isAlpha";
import {createUser, getAccessToken} from "../utils/APIDispatcher";
import {getErrorResponse} from "../utils/Utils";

function SignupView(props) {
    const {setAuthenticated, setAuthDetails} = useContext(UserContext)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [signupEror, setSignupError] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState("")
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [showForgotPasswordSnackbar, setShowForgotPasswordSnackbar] = useState(false)
    const [showLoadingButton, setShowLoadingButton] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const calorieLimit = DEFAULT_CALORIE_LIMIT

    const clearErrors = () => {
        setSignupError("")
        setUsernameError("")
        setPasswordError("")
        setConfirmPasswordError("")
        setNameError("")
        setEmailError("")
    }

    const signupUser = async (event) => {
        event.preventDefault()
        clearErrors()
        setShowLoadingButton(true)
        if (username.length < 6 || !isAlphanumeric(username, 'en-US', {ignore: ' -_@.'})) {
            setUsernameError(INVALID_USERNAME)
        } else if (!isStrongPassword(password)) {
            setPasswordError(INVALID_PASSWORD)
        } else if (password !== confirmPassword) {
            setConfirmPasswordError(CONFIRM_PASSWORD_ERROR)
        } else if (!isEmail(email)) {
            setEmailError(INVALID_EMAIL)
        } else if (name.length < 1 || !isAlpha(name, 'en-US', {ignore: ' '})) {
            setNameError(INVALID_NAME)
        } else {
            clearErrors()
            const params = {username, password, name, email, calorieLimit}
            const response = await createUser(params)
            if (response.ok) {
                const accessTokenResponse = await getAccessToken(params)
                if (accessTokenResponse.ok) {
                    const accessTokenResponseJson = await accessTokenResponse.json()
                    localStorage.setItem(AUTH_DETAILS, JSON.stringify(accessTokenResponseJson))
                    setAuthDetails(accessTokenResponseJson)
                    setAuthenticated(true)
                } else {
                    const errorResponse = await getErrorResponse(response)
                    setSignupError(errorResponse.errorMessage)
                }
            } else {
                const errorResponse = await getErrorResponse(response)
                setSignupError(errorResponse.errorMessage)
                setShowSnackbar(true)
            }
        }
        setShowLoadingButton(false)
    }

    return (
        <Container component="main" maxWidth="xs">
            <Loader showLoader={props.showLoader}/>
            <Snackbar open={showSnackbar} autoHideDuration={5000} onClose={() => setShowSnackbar(false)}>
                <MuiAlert elevation={6} variant="filled" onClose={() => setShowSnackbar(false)} severity="error"
                          sx={{width: '100%'}}>
                    {signupEror}
                </MuiAlert>
            </Snackbar>
            <Snackbar open={showForgotPasswordSnackbar} autoHideDuration={5000}
                      onClose={() => setShowForgotPasswordSnackbar(false)}>
                <MuiAlert elevation={6} variant="filled"
                          onClose={() => setShowForgotPasswordSnackbar(false)} severity="error"
                          sx={{width: '100%'}}>
                    Forgot Password feature is unavailable at this moment
                </MuiAlert>
            </Snackbar>
            <Box
                sx={{
                    marginTop: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlined/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        autoComplete="username"
                        autoFocus
                        placeholder={"Username"}
                        color={"secondary"}
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
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder={"Password"}
                        color={"secondary"}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Key color={"secondary"}/>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    {showPassword ? (
                                        <IconButton onClick={() => setShowPassword(false)}>
                                            <VisibilityOff/>
                                        </IconButton>
                                    ) : (
                                        <IconButton onClick={() => setShowPassword(true)}>
                                            <Visibility/>
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            )
                        }}
                        value={password}
                        error={passwordError.length > 0}
                        helperText={passwordError}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder={"Confirm Password"}
                        color={"secondary"}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Key color={"secondary"}/>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    {showConfirmPassword ? (
                                        <IconButton onClick={() => setShowConfirmPassword(false)}>
                                            <VisibilityOff/>
                                        </IconButton>
                                    ) : (
                                        <IconButton onClick={() => setShowConfirmPassword(true)}>
                                            <Visibility/>
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            )
                        }}
                        value={confirmPassword}
                        error={confirmPasswordError.length > 0}
                        helperText={confirmPasswordError}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        autoComplete="email"
                        placeholder={"Email"}
                        color={"secondary"}
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
                    <LoadingButton
                        fullWidth
                        onClick={signupUser}
                        loading={showLoadingButton}
                        loadingPosition="end"
                        sx={{mt: 3, mb: 2}}
                        variant="contained"
                        type="submit"
                    >
                        {showLoadingButton ? "Signing Up. Please wait..." : "Signup"}
                    </LoadingButton>
                    <Grid container>
                        <Grid item xs>
                            <Link variant="body1"
                                  sx={{cursor: "pointer"}} // TODO : Implement Forgot Password
                                  onClick={() => setShowForgotPasswordSnackbar(true)} color={"secondary"}>
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link variant="body1"
                                  sx={{cursor: "pointer"}}
                                  onClick={() => {
                                      props.setShowSignup(false)
                                      props.setShowLogin(true)
                                  }} color={"secondary"}>
                                {"Already have an account? Sign In"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}

export default SignupView