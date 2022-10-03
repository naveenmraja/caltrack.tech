import {Card, CardContent, Grid, Typography} from "@mui/material";

function Banner(props) {
    if (!props.bannerMessage) {
        return
    }
    const style = {
        maxWidth: "100%",
        backgroundColor: props.color ? props.color : "primary.main",
        paddingBotttom: "0px",
        margin: "auto",
        width: "fit-content"
    }
    return (
        <Grid item md={12} xs={12}>
            <Card raised sx={style}>
                <CardContent>
                    <Typography component={'span'} variant={"body1"} color={"white"}>
                        {props.bannerMessage}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default Banner