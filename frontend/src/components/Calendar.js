import {Calendar as ReactCalendar} from "react-calendar";
import {Avatar, Button, Popover} from "@mui/material";
import {useState} from "react";
import {StyledPaper} from "../utils/Constants";

function Calendar(props) {
    const [disableConfirmButton, setDisableConfirmButton] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const handleConfirmation = (event) => {
        setDisableConfirmButton(true)
        props.handleDateSelection(selectedDate)
        setDisableConfirmButton(false)
    }
    const formatDate = (date) => {
        if (date.getFullYear() >= 2000 && date <= new Date()) {
            return (
                <Avatar sx={{width: 24, height: 24, bgcolor: "#7c4dff", fontSize: 12, margin: "0 auto", color: "white"}}
                        variant={"square"}>
                    {date.getDate()}
                </Avatar>
            )
        } else {
            return (date.getDate())
        }
    }

    return (
        <Popover
            open={props.showPopover}
            anchorEl={props.anchorEl}
            onClose={props.onClosePopover}
            anchorOrigin={props.anchorOrigin}>
            <StyledPaper sx={{border: "none", outline: "none", bgcolor: "white"}}>
                <ReactCalendar maxDate={new Date()} minDate={new Date(2000, 0, 1)}
                               onChange={(value, event) => setSelectedDate(value)}
                               defaultValue={props.defaultValue}
                               selectRange={props.selectRange} allowPartialRange={props.selectRange}
                               defaultActiveStartDate={props.defaultActiveStartDate}
                               formatDay={(locale, date) => formatDate(date)}
                               sx={{border: "none", outline: "none"}}/>
                <Button fullWidth color={"primary"} variant={"contained"} sx={{margin: "2% auto"}}
                        onClick={handleConfirmation}
                        disabled={disableConfirmButton}>Confirm</Button>
            </StyledPaper>
        </Popover>
    )
}

export default Calendar