import React from 'react';

import NotFound from './components/404';
import Router from './Router';

const App: React.FC = () => {
    const route = window.location.pathname;
    
    const routes = Router.getRoutes();

    const Component = routes[route];

    if (!Component) return <NotFound />;

    return <Component />;
};

export default App;