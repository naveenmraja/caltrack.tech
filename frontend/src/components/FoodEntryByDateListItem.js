import {Fragment, useContext, useState} from "react";
import {Collapse, Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography} from "@mui/material";
import {CalendarToday, Error, ExpandLess, ExpandMore} from "@mui/icons-material";
import FoodEntryListItem from "./FoodEntryListItem";
import UserContext from "../utils/Constants";

function FoodEntryByDateListItem(props) {
    const {authDetails} = useContext(UserContext)
    const username = authDetails.username
    const [expand, setExpand] = useState(false)
    const entries = []
    props.entries.forEach((entry, index) => {
        entries.push(
            <FoodEntryListItem entry={entry} key={entry.id} username={username}
                               handleSuccessEvent={props.handleSuccessEvent}/>
        )
        if (index !== props.entries.length) {
            entries.push(<Divider key={`divider-${entry.id}`}/>)
        }
    })
    return (
        <Fragment>
            <ListItemButton onClick={() => setExpand(!expand)}>
                <ListItemIcon>
                    <CalendarToday/>
                </ListItemIcon>
                <ListItemText primary={
                    <Stack direction={"row"} justifyContent={"space-between"}>
                        <Typography variant={"body1"} color={"secondary"} sx={{width: "50%"}}>
                            <b>{props.date}</b>
                        </Typography>
                        <Stack direction={"row"} spacing={1} sx={{width: "50%"}}>
                            {props.limitExceeded ? (
                                <Error color={"error"} size={"small"}/>
                            ) : ""}
                            <Typography variant={"body1"} color={props.limitExceeded ? "error.main" : "secondary"}>
                                <b>{props.totalCalories} KCal</b>
                            </Typography>
                        </Stack>
                    </Stack>
                } secondary={`${props.entries.length} ${props.entries.length > 1 ? "entries" : "entry"}`}/>
                {expand ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={expand} timeout="auto" unmountOnExit>
                <List disablePadding>
                    {entries}
                </List>
            </Collapse>
        </Fragment>
    )
}

export default FoodEntryByDateListItem