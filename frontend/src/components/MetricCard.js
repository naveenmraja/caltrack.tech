import {Skeleton, Typography} from "@mui/material";
import {StyledPaper} from "../utils/Constants";

function MetricCard(props) {
    return (
        <StyledPaper elevation={12} sx={{padding: "5% 10%"}}
                     className={props.className ? props.className : "moonlitGradient"}>
            <Typography variant={"h6"} textAlign={"center"} color={"secondary"}>
                <b>{props.label}</b>
            </Typography>
            <Typography variant={"h3"} textAlign={"center"} color={"primary"}>
                {props.showLoader ? (
                    <Skeleton variant="text" width={"100%"} animation={"wave"}/>
                ) : (<b>{props.value}</b>)}
            </Typography>
        </StyledPaper>
    )
}

export default MetricCard