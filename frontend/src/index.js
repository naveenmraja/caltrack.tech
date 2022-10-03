import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/styles.css';
import './styles/calendar.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ff4081',
        },
        secondary: {
            main: '#ffffff',
        }
    }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <App/>
    </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
