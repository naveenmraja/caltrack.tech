import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    InputAdornment,
    Snackbar,
    Stack,
    TextField
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import {Badge, Email} from "@mui/icons-material";
import {LoadingButton} from "@mui/lab";
import {useContext, useState} from "react";
import UserContext from "../utils/Constants";
import isAlpha from "validator/es/lib/isAlpha";
import isEmail from "validator/es/lib/isEmail";
import {inviteFriend} from "../utils/APIDispatcher";
import {getErrorResponse} from "../utils/Utils";

function InviteFriendDialog(props) {
    const {setAuthenticated, authDetails} = useContext(UserContext)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [showLoader, setShowLoader] = useState(false)

    const clearErrors = () => {
        setNameError("")
        setEmailError("")
        setErrorMessage("")
    }

    const closeDialog = () => {
        clearErrors()
        setName("")
        setEmail("")
        props.closeDialog()
    }

    const sendInvitation = async (event) => {
        event.preventDefault()
        clearErrors()
        setShowLoader(true)
        if (!name) {
            setNameError("Please enter the name")
        } else if (!email) {
            setEmailError("Please enter the email")
        } else if (!isAlpha(name, 'en-US', {ignore: ' '})) {
            setNameError("Invalid name. Name should only contain alphabets")
        } else if (!isEmail(email)) {
            setEmailError("Invalid email id")
        } else {
            const params = {name, email}
            const response = await inviteFriend(params, authDetails.username, authDetails.accessToken)
            if (response.ok) {
                clearErrors()
                setName("")
                setEmail("")
                props.handleSuccessEvent()
            } else {
                const errorResponse = await getErrorResponse(response)
                if (errorResponse.statusCode === 401) {
                    setAuthenticated(false)
                } else {
                    setErrorMessage(errorResponse.errorMessage)
                    setShowSnackbar(true)
                }
            }
            setShowLoader(false)
        }
    }
    return (
        <Dialog open={props.showDialog} onClose={closeDialog}>
            <Snackbar open={showSnackbar} autoHideDuration={5000} onClose={() => setShowSnackbar(false)}>
                <MuiAlert elevation={6} variant="filled" onClose={() => setShowSnackbar(false)} severity="error"
                          sx={{width: '100%'}}>
                    {errorMessage}
                </MuiAlert>
            </Snackbar>
            <DialogTitle>Invite a Friend</DialogTitle>
            <DialogContent>
                <Box component="form" noValidate>
                    <TextField
                        autoFocus
                        margin="normal"
                        label="Name"
                        placeholder={"Name"}
                        color={"secondary"}
                        fullWidth
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
                        label="Email"
                        placeholder={"Email"}
                        color={"secondary"}
                        fullWidth
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
                    <Stack direction={"row"} spacing={2} sx={{mt: 1}}>
                        <Button color={"secondary"} variant={"contained"} onClick={closeDialog} disabled={showLoader}>
                            Cancel
                        </Button>
                        <LoadingButton
                            fullWidth
                            onClick={sendInvitation}
                            loading={showLoader}
                            loadingPosition="end"
                            sx={{mt: 3, mb: 2}}
                            type="submit"
                            variant="contained">
                            {showLoader ? "Sending an invite. Please wait..." : "Send Invite"}
                        </LoadingButton>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default InviteFriendDialog