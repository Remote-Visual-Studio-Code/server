import React from 'react';

import Editor from './pages/Editor';
import Home from './pages/Home';

export default class Router {
    static getRoutes(): { [key: string]: React.FC } {
        return {
            '/': Home,
            '/editor': Editor,
        };
    }
}