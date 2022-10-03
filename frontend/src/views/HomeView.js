import {useContext, useState} from "react";
import Loader from "../components/Loader";
import LoginView from "./LoginView";
import SignupView from "./SignupView";
import UserContext from "../utils/Constants";
import {Navigate} from "react-router-dom";

function HomeView() {
    const {authenticated} = useContext(UserContext)
    const [showLoader, setShowLoader] = useState(false)
    const [showLogin, setShowLogin] = useState(true)
    const [showSignup, setShowSignup] = useState(false)
    if (authenticated) {
        return (<Navigate to={"/dashboard"}/>)
    } else if (showLoader) {
        return (<Loader showLoader={showLoader}/>)
    } else if (showLogin) {
        return (<LoginView showLoader={showLoader} setShowLoader={setShowLoader} setShowSignup={setShowSignup}
                           setShowLogin={setShowLogin}/>)
    } else if (showSignup) {
        return (<SignupView showLoader={showLoader} setShowLoader={setShowLoader} setShowSignup={setShowSignup}
                            setShowLogin={setShowLogin}/>)
    }
}

export default HomeView