import React from 'react';
import Home from './pages/Home';

export default class Router {
    static getRoutes(): { [key: string]: React.FC } {
        return {
            '/': Home,
        };
    }
}