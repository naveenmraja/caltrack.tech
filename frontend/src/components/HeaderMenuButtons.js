import {
    Avatar,
    Button,
    Divider,
    Grid,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Snackbar,
    Stack
} from "@mui/material";
import {Email, Home, Logout, Menu as MenuIcon, Settings, SupervisorAccount} from "@mui/icons-material";
import UserContext, {UserRoles} from "../utils/Constants";
import {useContext, useRef, useState} from "react";
import {Link as RouterLink} from "react-router-dom";
import InviteFriendDialog from "./InviteFriendDialog";
import MuiAlert from "@mui/material/Alert";

function HeaderMenuButtons(props) {
    const {setAuthenticated, authDetails} = useContext(UserContext)
    const homeButtonRef = useRef()
    const settingsButtonRef = useRef()
    const adminDashboardButtonRef = useRef()
    const menuButtonRef = useRef()
    const [showMenu, setShowMenu] = useState(false)
    const [showInviteFriendDialog, setShowInviteFriendDialog] = useState(false)
    const [showInviteFriendSuccessSnackbar, setShowInviteFriendSuccessSnackbar] = useState(false)
    const logoutUser = () => {
        setShowMenu(false)
        setAuthenticated(false)
    }
    const handleInviteFriendSuccessEvent = () => {
        setShowInviteFriendDialog(false)
        setShowInviteFriendSuccessSnackbar(true)
    }
    const menuMap = [
        {
            label: "Admin Dashboard",
            accessLevel: UserRoles.Admin,
            icon: <SupervisorAccount color={"secondary"}/>,
            onClick: () => {
                setShowMenu(false)
                adminDashboardButtonRef.current.click()
            }
        },
        {
            label: "Invite a friend",
            accessLevel: UserRoles.User,
            icon: <Email color={"secondary"}/>,
            onClick: () => {
                setShowMenu(false)
                setShowInviteFriendDialog(true)
            }
        },
        {
            label: "Settings",
            accessLevel: UserRoles.User,
            icon: <Settings color={"secondary"}/>,
            onClick: () => {
                setShowMenu(false)
                settingsButtonRef.current.click()
            }
        },
        {
            label: "Logout",
            accessLevel: UserRoles.User,
            icon: <Logout color={"primary"}/>,
            onClick: logoutUser
        }
    ]
    const menuItems = []
    menuMap.forEach((item, index) => {
        if ((item.accessLevel === UserRoles.User) ||
            (item.accessLevel === UserRoles.Admin && authDetails.role === UserRoles.Admin)) {
            menuItems.push(
                <MenuItem onClick={item.onClick} key={`menu-item-${index}`}>
                    <ListItemIcon>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText>{item.label}</ListItemText>
                </MenuItem>
            )
            if (index !== menuMap.length - 1)
                menuItems.push(<Divider key={`menu-divider-${index}`}/>)
        }
    })
    if (!props.showButtons) {
        return
    }
    return (
        <Grid item xs={6} md={5}>
            <RouterLink hidden to={"/"}>
                <Button ref={homeButtonRef}/>
            </RouterLink>
            <RouterLink hidden to={"/settings"}>
                <Button ref={settingsButtonRef}/>
            </RouterLink>
            <RouterLink hidden to={"/admin"}>
                <Button ref={adminDashboardButtonRef}/>
            </RouterLink>
            <Snackbar open={showInviteFriendSuccessSnackbar} autoHideDuration={5000}
                      onClose={() => setShowInviteFriendSuccessSnackbar(false)}>
                <MuiAlert elevation={6} variant="filled" onClose={() => setShowInviteFriendSuccessSnackbar(false)}
                          severity="success" sx={{width: '100%'}}>
                    Sent an invitation successfully !
                </MuiAlert>
            </Snackbar>
            <InviteFriendDialog showDialog={showInviteFriendDialog}
                                closeDialog={() => setShowInviteFriendDialog(false)}
                                handleSuccessEvent={handleInviteFriendSuccessEvent}/>
            <Stack direction={"row"} sx={{float: "right"}}>
                <Avatar sx={{bgcolor: "primary.main", mt: 2, mb: 2, ml: 2}}>
                    <IconButton sx={{color: "white"}}
                                onClick={() => homeButtonRef.current.click()}>
                        <Home/>
                    </IconButton>
                </Avatar>
                <Avatar sx={{bgcolor: "primary.main", mt: 2, mb: 2, ml: 2}}>
                    <IconButton sx={{color: "white"}} ref={menuButtonRef}
                                onClick={() => setShowMenu(true)}>
                        <MenuIcon/>
                    </IconButton>
                </Avatar>
            </Stack>
            <Menu
                anchorEl={menuButtonRef.current}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={showMenu}
                onClose={() => setShowMenu(false)}
                sx={{mt: 1}}>
                {menuItems}
            </Menu>
        </Grid>
    )
}

export default HeaderMenuButtons