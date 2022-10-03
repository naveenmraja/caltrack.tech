import {
    Avatar,
    Checkbox,
    Container,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import Link from '@mui/material/Link';
import MuiAlert from "@mui/material/Alert";
import * as React from 'react';
import {useContext, useState} from 'react';
import {Key, LockOutlined, Person, Visibility, VisibilityOff} from "@mui/icons-material";
import Loader from "../components/Loader";
import {LoadingButton} from "@mui/lab";
import isAlphanumeric from "validator/es/lib/isAlphanumeric";
import isStrongPassword from "validator/es/lib/isStrongPassword";
import UserContext, {AUTH_DETAILS, INVALID_PASSWORD, INVALID_USERNAME} from "../utils/Constants";
import {getAccessToken} from "../utils/APIDispatcher";
import {getErrorResponse} from "../utils/Utils";

function LoginView(props) {
    const {setAuthenticated, setAuthDetails} = useContext(UserContext)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [loginError, setLoginError] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [showForgotPasswordSnackbar, setShowForgotPasswordSnackbar] = useState(false)
    const [showLoadingButton, setShowLoadingButton] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const clearErrors = () => {
        setLoginError("")
        setUsernameError("")
        setPasswordError("")
    }

    const loginUser = async (event) => {
        event.preventDefault()
        clearErrors()
        setShowLoadingButton(true)
        if (username.length < 6 || !isAlphanumeric(username, 'en-US', {ignore: ' -_@.'})) {
            setUsernameError(INVALID_USERNAME)
        } else if (!isStrongPassword(password)) {
            setPasswordError(INVALID_PASSWORD)
        } else {
            const params = {
                username: username,
                password: password,
                rememberMe: rememberMe
            }
            const response = await getAccessToken(params)
            if (response.ok) {
                const responseJson = await response.json()
                localStorage.setItem(AUTH_DETAILS, JSON.stringify(responseJson))
                setAuthDetails(responseJson)
                setAuthenticated(true)
            } else {
                const errorResponse = await getErrorResponse(response)
                setLoginError(errorResponse.errorMessage)
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
                    {loginError}
                </MuiAlert>
            </Snackbar>
            <Snackbar open={showForgotPasswordSnackbar} autoHideDuration={5000}
                      onClose={() => setShowForgotPasswordSnackbar(false)}>
                <MuiAlert elevation={6} variant="filled" onClose={() => setShowForgotPasswordSnackbar(false)}
                          severity="error" sx={{width: '100%'}}>
                    Forgot Password feature is unavailable at this moment
                </MuiAlert>
            </Snackbar>
            <Box
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlined/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
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
                        error={passwordError.length > 0}
                        helperText={passwordError}
                        color={"secondary"}
                        autoComplete="current-password"
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
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder={"Password"}
                        value={password}
                    />
                    <FormControlLabel
                        control={<Checkbox checked={rememberMe} color="secondary"
                                           onChange={(event) => setRememberMe(event.target.checked)}/>}
                        label="Remember me"/>
                    <LoadingButton
                        fullWidth
                        onClick={loginUser}
                        loading={showLoadingButton}
                        loadingPosition="end"
                        sx={{mt: 3, mb: 2}}
                        variant="contained"
                        type="submit"
                    >
                        {showLoadingButton ? "Logging In. Please wait..." : "Login"}
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
                                      props.setShowLogin(false)
                                      props.setShowSignup(true)
                                  }} color={"secondary"}>
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}

export default LoginView