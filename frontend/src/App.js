import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import HomeView from "./views/HomeView";
import {Box} from "@mui/material";
import UserDashboardView from "./views/UserDashboardView";
import UserContext, {AUTH_DETAILS} from "./utils/Constants";
import {useEffect, useState} from "react";
import AdminDashboardView from "./views/AdminDashboardView";
import SettingsView from "./views/SettingsView";
import {getUser} from "./utils/APIDispatcher";

function App() {
    let accessTokenExpiry = 0
    let authDetailJson = {}
    const authDetailsCache = localStorage.getItem(AUTH_DETAILS)
    if (authDetailsCache) {
        authDetailJson = JSON.parse(authDetailsCache)
        accessTokenExpiry = authDetailJson.accessTokenExpiry
    }
    const [authenticated, setAuthenticated] = useState(Date.now() < accessTokenExpiry)
    const [authDetails, setAuthDetails] = useState(authDetailJson)
    const [userDetails, setUserDetails] = useState({})

    async function populateUserDetails(attempt) {
        if (authenticated && attempt < 5) {
            const response = await getUser(authDetails.username)
            if (response.ok) {
                const responseJson = await response.json()
                setUserDetails(responseJson)
            } else {
                setTimeout(() => populateUserDetails(attempt + 1), 30000)
            }
        }
    }

    useEffect(() => {
        if (authenticated) {
            populateUserDetails(0)
        } else if (!authenticated) {
            localStorage.removeItem(AUTH_DETAILS)
            setAuthDetails({})
            setUserDetails({})
        }
    }, [authenticated])
    
    return (
        <UserContext.Provider value={{
            authenticated, setAuthenticated, authDetails, setAuthDetails,
            userDetails, setUserDetails
        }}>
            <Router>
                <Header/>
                <Box sx={{height: "90%", width: "100%"}}>
                    <Box className={"baseContainer homeContainer moonlitGradient"}>
                        <Routes>
                            <Route path="/">
                                <Route index element={<HomeView/>}/>
                                <Route path="dashboard" element={<UserDashboardView/>}/>
                                <Route path="admin" element={<AdminDashboardView/>}/>
                                <Route path="settings" element={<SettingsView/>}/>
                                <Route path="*" element={<HomeView/>}/>
                            </Route>
                        </Routes>
                    </Box>
                </Box>
            </Router>
        </UserContext.Provider>
    );
}

export default App;
