import React from 'react';

import NotFound from './components/404';
import Router from './Router';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontSize: 14,
    },
});

const App: React.FC = () => {
    const route = window.location.pathname;
    
    const routes = Router.getRoutes();

    const Component = routes[route];

    if (!Component) return <NotFound />;

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Component />
        </ThemeProvider>
    );
};

export default App;