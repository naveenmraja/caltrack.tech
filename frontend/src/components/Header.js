import {AppBar, Grid, Toolbar} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {useContext} from "react";
import UserContext from "../utils/Constants";
import HeaderMenuButtons from "./HeaderMenuButtons";

function Header() {
    const {authenticated} = useContext(UserContext)
    return (
        <AppBar position="static" sx={{height: "10%"}}>
            <Toolbar className={"noPaddingLeft noPaddingTop"} sx={{height: "100%"}}>
                <Grid container sx={{height: "100%"}}>
                    <Grid item xs={6} md={6} className={"noPaddingLeft noPaddingTop"} sx={{height: "100%"}}>
                        <RouterLink to={"/"} style={{height: "100%"}}>
                            <img src={"/caltrack-logo.png"} alt={"CalTrack"} style={{height: "100%"}}/>
                        </RouterLink>
                    </Grid>
                    <HeaderMenuButtons showButtons={authenticated}/>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}

export default Header