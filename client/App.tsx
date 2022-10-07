import React from 'react';

import Router from './Router';

const App: React.FC = () => {
    const route = window.location.pathname;
    
    const routes = Router.getRoutes();

    const Component = routes[route];

    if (!Component) return <div>404 Not Found</div>;

    return <Component />;
};

export default App;