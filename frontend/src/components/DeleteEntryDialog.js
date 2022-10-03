import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar} from "@mui/material";
import {useContext, useState} from "react";
import UserContext, {DELETE_ENTRY} from "../utils/Constants";
import {LoadingButton} from "@mui/lab";
import {deleteFoodEntry} from "../utils/APIDispatcher";
import MuiAlert from "@mui/material/Alert";
import {getErrorResponse} from "../utils/Utils";

function DeleteEntryDialog(props) {
    const {setAuthenticated, authDetails} = useContext(UserContext)
    const [showLoader, setShowLoader] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [showSnackbar, setShowSnackbar] = useState(false)
    const handleDelete = async () => {
        setErrorMessage("")
        setShowLoader(true)
        const response = await deleteFoodEntry(props.username, props.entryId, authDetails.accessToken)
        if (response.ok) {
            setShowLoader(false)
            props.closeDialog()
            props.handleSuccessEvent(DELETE_ENTRY)
        } else {
            const errorResponse = await getErrorResponse(response)
            if (errorResponse.statusCode === 401) {
                setAuthenticated(false)
            } else {
                setErrorMessage(errorResponse.errorMessage)
                setShowLoader(false)
                setShowSnackbar(true)
            }
        }
    }
    return (
        <Dialog
            open={props.showDialog}
            onClose={props.closeDialog}>
            <Snackbar open={showSnackbar} autoHideDuration={5000} onClose={() => setShowSnackbar(false)}>
                <MuiAlert elevation={6} variant="filled" onClose={() => setShowSnackbar(false)} severity="error"
                          sx={{width: '100%'}}>
                    {errorMessage}
                </MuiAlert>
            </Snackbar>
            <DialogTitle id="alert-dialog-title">
                {"Confirm Entry Deletion"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this entry?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.closeDialog} disabled={showLoader}>No</Button>
                <LoadingButton
                    autoFocus
                    onClick={handleDelete}
                    loading={showLoader}
                    loadingPosition="end">
                    Yes
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteEntryDialog