import {
    Button,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    List,
    MenuItem,
    Pagination,
    Select,
    Skeleton,
    Snackbar,
    Stack,
    Tab,
    Tabs,
    tabsClasses,
    Typography,
    useMediaQuery
} from "@mui/material";
import {ArrowBack, Create, FilterAlt} from "@mui/icons-material";
import Calendar from "../components/Calendar"
import {useContext, useEffect, useRef, useState} from "react";
import {
    daysInMonth,
    getAllowedYears,
    getCurrentMonth,
    getCurrentYear,
    getErrorResponse,
    getMonths,
    prefixZero
} from "../utils/Utils";
import {listFoodEntriesByDate} from "../utils/APIDispatcher";
import UserContext, {
    CREATE_ENTRY,
    DEFAULT_CALORIE_LIMIT,
    DELETE_ENTRY,
    NO_ENTRIES_MESSAGE,
    StyledPaper,
    UPDATE_ENTRY
} from "../utils/Constants";
import FoodEntryByDateListItem from "../components/FoodEntryByDateListItem";
import MetricCard from "../components/MetricCard";
import Banner from "../components/Banner";
import CreateOrUpdateEntryDialog from "../components/CreateOrUpdateEntryDialog";
import {Navigate} from "react-router-dom";
import MuiAlert from "@mui/material/Alert";


function UserDashboardView() {
    const {authenticated, setAuthenticated, authDetails, userDetails} = useContext(UserContext)
    const username = authDetails.username
    const bigScreen = useMediaQuery((theme) => theme.breakpoints.up('sm'))
    const [showLoader, setShowLoader] = useState(true)
    const [showCreateEntryPopover, setShowCreateEntryPopover] = useState(false)
    const [showFilterPopover, setShowFilterPopover] = useState(false)
    const [customFilterResult, setCustomFilterResult] = useState(false)
    const [createEntryDate, setCreateEntryDate] = useState(new Date())
    const [showCreateEntryDialog, setShowCreateEntryDialog] = useState(false)
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
    const [successSnackbarMessage, setSuccessSnackbarMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [currentYear, setCurrentYear] = useState(getCurrentYear())
    const [currentMonth, setCurrentMonth] = useState(getCurrentMonth())
    const [foodEntries, setFoodEntries] = useState([])
    const [refreshEntries, setRefreshEntries] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCalories, setTotalCalories] = useState(0)
    const [averageCalories, setAverageCalories] = useState(0)
    const [calorieLimit, setCalorieLimit] = useState(userDetails.calorieLimit ? userDetails.calorieLimit : DEFAULT_CALORIE_LIMIT)

    const [dateRange, setDateRange] = useState({
        startDate: `${getCurrentYear()}-${prefixZero(getCurrentMonth())}-01`,
        endDate: `${getCurrentYear()}-${prefixZero(getCurrentMonth())}-${daysInMonth(getCurrentMonth(), getCurrentYear())}`
    })

    const createEntryButtonRef = useRef()
    const filterButtonRef = useRef()

    const years = getAllowedYears()
    const months = getMonths()
    let yearsMenuItems = []
    let monthsTabs = []
    years.forEach((year) => {
        yearsMenuItems.push(<MenuItem value={year.value} key={`Year:${year.value}`}>{year.label}</MenuItem>)
    })
    months.forEach((month) => {
        monthsTabs.push(<Tab value={month.value} label={month.label} key={`Month:${month.value}`}/>)
    })

    async function fetchEntries() {
        setErrorMessage("")
        const params = {
            skip: (currentPage - 1) * 5,
            limit: 5,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
        }
        const response = await listFoodEntriesByDate(params, username, authDetails.accessToken)
        if (response.ok) {
            const responseJson = await response.json()
            const totalEntries = responseJson.total
            if (responseJson.count > 0) {
                setTotalPages(Math.floor(totalEntries / 5) + (totalEntries % 5 > 0 ? 1 : 0))
                setFoodEntries(responseJson.data)
                setTotalCalories(responseJson.totalCalories)
                setAverageCalories(responseJson.averageCalories)
                setCalorieLimit(responseJson.calorieLimit)
            } else if (totalEntries > 0) {
                setCurrentPage(currentPage - 1)
            } else {
                setFoodEntries([])
                setTotalPages(1)
                setCurrentPage(1)
                setTotalCalories(0)
                setAverageCalories(0)
            }
        } else {
            const errorResponse = await getErrorResponse(response)
            if (errorResponse.statusCode === 401) {
                setAuthenticated(false)
            } else {
                setFoodEntries([])
                setTotalPages(1)
                setCurrentPage(1)
                setTotalCalories(0)
                setAverageCalories(0)
                setErrorMessage(errorResponse.errorMessage)
            }
        }
        setShowLoader(false)
    }

    useEffect(() => {
        fetchEntries()
    }, [currentPage])

    useEffect(() => {
        setShowLoader(true)
        fetchEntries()
    }, [refreshEntries, dateRange])

    const handleDateRangeSelection = (selectedDateRange) => {
        setShowFilterPopover(false)
        if (selectedDateRange.length > 1) {
            const startDate = selectedDateRange[0]
            const endDate = selectedDateRange[1]
            const dateRange = {
                startDate: `${startDate.getFullYear()}-${prefixZero(startDate.getMonth() + 1)}-${prefixZero(startDate.getDate())}`,
                endDate: `${endDate.getFullYear()}-${prefixZero(endDate.getMonth() + 1)}-${prefixZero(endDate.getDate())}`
            }
            setDateRange(dateRange)
        } else {
            const date = `${selectedDateRange[0].getFullYear()}-${prefixZero(selectedDateRange[0].getMonth() + 1)}-${prefixZero(selectedDateRange[0].getDate())}`
            const dateRange = {
                startDate: date,
                endDate: date
            }
            setDateRange(dateRange)
        }
        setCustomFilterResult(true)
    }

    const createEntry = (selectedDate) => {
        setShowCreateEntryPopover(false)
        setCreateEntryDate(selectedDate)
        setShowCreateEntryDialog(true)
    }

    const updateCurrentYear = (event) => {
        const year = event.target.value
        const currentDate = new Date()
        let month = 1
        if (year === currentDate.getFullYear()) {
            month = currentDate.getMonth() + 1
        }
        const totalDays = daysInMonth(month, year)
        setCurrentYear(year)
        setCurrentMonth(month)
        setDateRange({
            startDate: `${year}-${prefixZero(month)}-01`,
            endDate: `${year}-${prefixZero(month)}-${totalDays}`
        })
    }

    const exitCustomFilterResult = (event) => {
        setCustomFilterResult(false)
        setDateRange({
            startDate: `${currentYear}-${prefixZero(currentMonth)}-01`,
            endDate: `${currentYear}-${prefixZero(currentMonth)}-${daysInMonth(currentMonth, currentYear)}`
        })
    }

    const updateCurrentMonth = (event, month) => {
        setCurrentMonth(month)
        setDateRange({
            startDate: `${currentYear}-${prefixZero(month)}-01`,
            endDate: `${currentYear}-${prefixZero(month)}-${daysInMonth(month, currentYear)}`
        })
    }

    const handleSuccessEvent = (event) => {
        setRefreshEntries(refreshEntries + 1)
        if (event === CREATE_ENTRY) {
            setSuccessSnackbarMessage("Entry created successfully")
        } else if (event === UPDATE_ENTRY) {
            setSuccessSnackbarMessage("Entry update successfully")
        } else if (event === DELETE_ENTRY) {
            setSuccessSnackbarMessage("Entry deleted successfully")
        }
        setShowSuccessSnackbar(true)
    }

    const foodEntriesListItems = []
    foodEntries.forEach((foodEntry, index) => {
        foodEntriesListItems.push(
            <FoodEntryByDateListItem {...foodEntry} key={`foodEntry-${index}`}
                                     handleSuccessEvent={handleSuccessEvent}/>
        )
        if (index !== foodEntries.length - 1) {
            foodEntriesListItems.push(<Divider key={`foodEntry-divider-${index}`}/>)
        }
    })

    const foodEntriesLoaders = []
    for (let i = 0; i < 5; i++)
        foodEntriesLoaders.push(
            <Skeleton variant="rounded" width={"100%"} height={"15%"} key={`food-entry-loader-${i}`}
                      sx={{m: 2}} animation={"wave"}/>
        )

    if (!authenticated) {
        return (<Navigate to={"/"}/>)
    }

    return (
        <Grid container alignItems="center" justify="center" direction={"row"}
              sx={{height: "100%", width: "100%"}}>
            <CreateOrUpdateEntryDialog showDialog={showCreateEntryDialog}
                                       command={CREATE_ENTRY}
                                       closeDialog={() => setShowCreateEntryDialog(false)}
                                       date={createEntryDate}
                                       username={username}
                                       handleSuccessEvent={handleSuccessEvent}/>
            <Snackbar open={showSuccessSnackbar} autoHideDuration={5000} onClose={() => setShowSuccessSnackbar(false)}>
                <MuiAlert elevation={6} variant="filled" onClose={() => setShowSuccessSnackbar(false)}
                          severity="success" sx={{width: '100%'}}>
                    {successSnackbarMessage}
                </MuiAlert>
            </Snackbar>
            <Grid container alignItems="center" direction={"row"}
                  sx={{height: "10%", width: "100%"}}>
                <Grid item xs={1} md={1}/>
                <Grid item xs={5} md={4}>
                    <Stack direction={"row"} spacing={2}>
                        <Button color={"secondary"} variant="contained" ref={createEntryButtonRef}
                                startIcon={bigScreen ? (<Create/>) : ""}
                                onClick={() => setShowCreateEntryPopover(true)}>
                            {bigScreen ? "New Entry" : (<Create/>)}
                        </Button>
                        <Button color={"primary"} variant="contained" ref={filterButtonRef}
                                startIcon={bigScreen ? (<FilterAlt/>) : ""} onClick={() => setShowFilterPopover(true)}>
                            {bigScreen ? "Filter" : (<FilterAlt/>)}
                        </Button>
                    </Stack>
                    <Calendar showPopover={showCreateEntryPopover}
                              onClosePopover={() => setShowCreateEntryPopover(false)}
                              anchorEl={createEntryButtonRef.current}
                              anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                              handleDateSelection={createEntry}/>
                    <Calendar showPopover={showFilterPopover}
                              onClosePopover={() => setShowFilterPopover(false)}
                              anchorEl={filterButtonRef.current}
                              selectRange={true}
                              anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                              handleDateSelection={handleDateRangeSelection}/>
                </Grid>
                <Grid item xs={5} md={6}>
                    <FormControl sx={{minWidth: 120, float: 'right'}} size={"small"} color={"secondary"}>
                        <InputLabel id="yearSelect">Year</InputLabel>
                        <Select value={currentYear} label="Year" onChange={updateCurrentYear}>
                            {yearsMenuItems}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container
                  sx={{height: "90%", width: "100%"}}>
                <Grid item xs={1} md={1}/>
                <Grid item xs={12} md={10} sx={{height: "100%"}}>
                    <StyledPaper elevation={24} sx={{height: "100%", padding: "2%", width: "100%"}}>
                        <Grid container direction={"row"} sx={{height: "10%", width: "100%"}}>
                            {customFilterResult ? (
                                <Grid item xs={12} md={12} sx={{height: "100%"}}>
                                    <Stack direction={"row"} spacing={2}>
                                        <Button color={"primary"} onClick={exitCustomFilterResult}
                                                variant={"contained"}>
                                            <ArrowBack/>
                                        </Button>
                                        <Typography variant={"h5"} color={"secondary"} textAlign={"center"}>
                                            <b>Displaying entries
                                                between {dateRange.startDate} and {dateRange.endDate}</b>
                                        </Typography>
                                    </Stack>
                                </Grid>
                            ) : (
                                <Grid item xs={12} md={12} sx={{height: "100%"}}>
                                    <Tabs value={currentMonth} onChange={updateCurrentMonth}
                                          textColor="secondary" indicatorColor="primary" variant="scrollable"
                                          scrollButtons sx={{
                                        [`& .${tabsClasses.scrollButtons}`]: {
                                            '&.Mui-disabled': {opacity: 0.3},
                                        },
                                    }}>
                                        {monthsTabs}
                                    </Tabs>
                                </Grid>
                            )}
                        </Grid>
                        <Grid container spacing={2} direction={"row"} alignItems={"center"} justifyContent={"center"}
                              sx={{height: "90%", overflow: "scroll", mt: "1%"}}>
                            <Grid item xs={12} md={4} sx={{height: bigScreen ? "100%" : "fit-content"}}>
                                <Grid container spacing={2} direction={"row"} alignItems={"start"}
                                      justifyContent={"center"}
                                      sx={{height: bigScreen ? "100%" : "fit-content"}}>
                                    <Grid item md={10} xs={10}>
                                        <MetricCard label={"Total Calories Consumed"}
                                                    value={totalCalories}
                                                    showLoader={showLoader}
                                                    className={"frostGradient"}/>
                                    </Grid>
                                    <Grid item md={10} xs={10}>
                                        <MetricCard label={"Average Calories Per Day"}
                                                    value={averageCalories}
                                                    showLoader={showLoader}
                                                    className={"underTheLakeGradient"}/>
                                    </Grid>
                                    <Grid item md={10} xs={10}>
                                        <MetricCard label={"Calorie Limit Per Day"}
                                                    value={calorieLimit}
                                                    showLoader={showLoader}
                                                    className={"twitchGradient"}/>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={8} sx={{height: bigScreen ? "100%" : "fit-content"}}>
                                <Grid container spacing={2} direction={"row"} alignItems={"center"}
                                      justifyContent={"center"}
                                      sx={{height: bigScreen ? "100%" : "fit-content"}}>
                                    <Grid item xs={12} md={12} sx={{
                                        height: bigScreen ? "90%" : "fit-content",
                                        overflow: 'scroll'
                                    }}>
                                        <StyledPaper elevation={12} sx={{
                                            padding: "2%", height: bigScreen ? "100%" : "fit-content",
                                            overflow: 'scroll'
                                        }} className={"purpleBlissGradient"}>
                                            {showLoader ? (foodEntriesLoaders) : (
                                                <List className={"purpleBlissGradient"} sx={{m: 1}}>
                                                    {foodEntriesListItems.length > 0 ? (foodEntriesListItems) : (
                                                        <Banner
                                                            bannerMessage={errorMessage ? errorMessage : NO_ENTRIES_MESSAGE}
                                                            color={errorMessage ? "error.main" : "primary.main"}/>
                                                    )}
                                                </List>)
                                            }
                                        </StyledPaper>
                                    </Grid>
                                    <Grid item sx={{height: bigScreen ? "10%" : "fit-content"}}>
                                        <Pagination count={totalPages} color="secondary" page={currentPage}
                                                    onChange={(event, page) => setCurrentPage(page)}
                                                    sx={{margin: "0 auto"}}/>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </StyledPaper>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default UserDashboardView