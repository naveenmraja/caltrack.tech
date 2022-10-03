import {
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    useMediaQuery
} from "@mui/material";
import {Delete, Edit, Fastfood} from "@mui/icons-material";
import CreateOrUpdateEntryDialog from "./CreateOrUpdateEntryDialog";
import {useState} from "react";
import {UPDATE_ENTRY} from "../utils/Constants";
import DeleteEntryDialog from "./DeleteEntryDialog";

function FoodEntryListItem(props) {
    const bigScreen = useMediaQuery((theme) => theme.breakpoints.up('sm'))
    const [showUpdateEntryDialog, setShowUpdateEntryDialog] = useState(false)
    const [showDeleteEntryDialog, setShowDeleteEntryDialog] = useState(false)
    return (
        <ListItem disablePadding alignItems="flex-start"
                  secondaryAction={
                      <Stack direction={"row"}>
                          <IconButton onClick={() => setShowUpdateEntryDialog(true)}>
                              <Edit/>
                          </IconButton>
                          <IconButton onClick={() => setShowDeleteEntryDialog(true)}>
                              <Delete/>
                          </IconButton>
                      </Stack>
                  } sx={{pl: bigScreen ? 4 : 0}} key={props.entry.id}>
            <ListItemButton onClick={() => setShowUpdateEntryDialog(true)}>
                <ListItemIcon>
                    <Fastfood/>
                </ListItemIcon>
                <ListItemText primary={
                    <Stack direction={"row"} justifyContent={bigScreen ? "space-between" : "start"}>
                        <Typography variant={"body1"} color={"secondary"} textAlign={"left"}
                                    sx={{width: props.entry.username ? "25%" : "33.33%"}}>
                            <b>{props.entry.food}</b>
                        </Typography>
                        {bigScreen ? (
                            <Typography variant={"body1"} color={"secondary"} textAlign={"left"}
                                        sx={{width: props.entry.username ? "25%" : "33.33%"}}>
                                <b>{props.entry.calories} KCal</b>
                            </Typography>) : ""}
                        {props.entry.username ? (
                            <Typography variant={"body1"} color={"secondary"} textAlign={"left"}
                                        sx={{width: props.entry.username ? "25%" : "33.33%"}}>
                                <b>{props.entry.username}</b>
                            </Typography>
                        ) : ""}
                        <Typography sx={{width: props.entry.username ? "25%" : "33.33%"}}/>
                    </Stack>
                } secondary={props.entry.username ? `${props.entry.consumptionDate} ${props.entry.consumptionTime}`
                    : props.entry.consumptionTime}/>
            </ListItemButton>
            <CreateOrUpdateEntryDialog showDialog={showUpdateEntryDialog}
                                       {...props.entry}
                                       command={UPDATE_ENTRY}
                                       username={props.username}
                                       closeDialog={() => setShowUpdateEntryDialog(false)}
                                       date={new Date(props.entry.consumptionDate)}
                                       handleSuccessEvent={props.handleSuccessEvent}/>
            <DeleteEntryDialog showDialog={showDeleteEntryDialog}
                               closeDialog={() => setShowDeleteEntryDialog(false)}
                               username={props.username}
                               handleSuccessEvent={props.handleSuccessEvent}
                               entryId={props.entry.id}/>
        </ListItem>
    )
}

export default FoodEntryListItem