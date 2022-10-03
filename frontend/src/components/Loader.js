import {Backdrop, CircularProgress} from "@mui/material";

function Loader(props) {
    if (!props.showLoader) {
        return
    }
    return (
        <Backdrop
            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open={props.showLoader}
        >
            <CircularProgress color="success"/>
        </Backdrop>
    )
}

export default Loader