DISCLAIMER: Easier to read in Visual Studio Code because styles in markdown are not supported in github.

<style>
bold {
    font-weight: bold;
}

green {
    color: #0eb676;
}

aqua {
    color: #12a3c6;
}

white {
    color: #cccccc;
}
</style>

# <aqua>Remote Visual Studio Code</aqua> Server

Repository for the <bold><aqua>Remote Visual Studio Code</aqua></bold> server.

## <green>Table of Contents</green>

<ul>

<li><a href="#usage">Usage</a></li>
    - <a href="#installation">Installation</a>
<li><a href="#contributing">Contributing</a></li>
    - <a href="#backend">Backend</a>
    <br>
    - <a href="#frontend">Frontend</a>
    <br>
    - <a href="#api">API</a>

</ul>

<div id="usage">

# <aqua>Usage</aqua>

<div id="installation">

## <green>Installation</green>

#### Install via Yarn

```bash
$ yarn install
```

#### Install via NPM

```bash
$ npm install
```

### Adding your `.env` file

<p><bold>$</bold> node scripts/env.js

<green>? </green><bold>Enter a MongoDB URI: </bold><aqua>mongodb+srv://USERNAME:PASSWORD@DATABASE.rxwax.mongodb.net/DATABASE?retryWrites=true&w=majority</aqua>

<green>? </green><bold>Enter a port number: </bold><aqua>8000</aqua>

</p>

Output:

```d
DATABASE_URI="mongodb+srv://USERNAME:PASSWORD@DATABASE.rxwax.mongodb.net/DATABASE?retryWrites=true&w=majority"
PROD_URL="https://remote-vscode.tech" // Default
PORT=8000
```

### Running the server

```bash
$ yarn start
```

Or

```bash
$ npm run start
```

</div>
</div>

<div id="contributing">

# <aqua>Contributing</aqua>

This project is <aqua>sperated</aqua> into a few sections.

<div id="backend">

## <green>Backend</green>

The main code for the server is in the <aqua>src/server.ts</aqua> and the following folders:

-   <aqua>src/api</aqua> - The API for the server.
-   <aqua>src/models</aqua> - The models for the database of server.
-   <aqua>src/utils</aqua> - Utility functions for the server.

</div>

<div id="frontend">

## <green>Frontend</green>

The frontend has two different parts:

-   <aqua>src/pages</aqua> - The pages for the server.

    -   Routing for the UI. Each page has 2 files: a `meta` file, and a `ejs` file. The EJS file is the HTML file for the page, and the `meta` file tells the server what the page is, the route, title, meta tags, web typescript, css, javascript, and more.

    -   Example of a page:

    <aqua>src/pages/data/index.ejs.json</aqua>

    ```JSON
    {
        "name": "index.ejs",
        "title": "Home", // Title tag
        "route": {
            "override": true, // Override the default route, which in this case would be `/index`
            "path": "/", // Not needed if `override` is false
            "method": "GET" // Not needed if `override` is false
        },
        "dependencies": [
            "exceptions" // `src/ts/src/exceptions.ts`
        ],
        "imports": {
            "css": [],
            "js": [
                "https://cdn.tailwindcss.com/dist/tailwind.min.js"
            ],
            "custom_js": [
                // Here you can add custom JavaScript, for example:
                "console.log('Hello World')" // This will be included as a <script> tag on the page
            ]
        },
        "meta": [
            // You can add as many meta tags as you want
            {
                "name": "viewport",
                "content": "width=device-width, initial-scale=1"
            },
            {
                "name": "description",
                "content": "The home page of the website"
            },
            {
                "name": "keywords",
                "content": "home, index, page"
            }
        ],
        "header": "<another>header</tag>\n<another></tag>", // Add more tags to the header
        // This code executes on the server
        "callback": "logger.info('Index loaded!', 'Router');" // The logger class is default imported for all callbacks
    }
    ```

    <aqua>src/pages/pages/index.ejs</aqua>

    ```html
    <h1>Hello world!</h1>
    ```

-   <aqua>src/ts</aqua> - Web Typescript files.
    -   Web TypeScript, or `bundles`, are TypeScript files that are compiled into a minfied file with a random name, for example: `_d85favsog.js`. Then they are assigned a route like `/api/bundle/_d85favsog.js`. The browser can then access them from their original names, listed as dependencies in their `meta` file.
    -   <aqua>src/ts/min/minify.js</aqua> - A script that compiles and minfies all web TypeScript files.
        <br>
        Minify files:
        ```bash
        $ yarn run buildweb
        $ yarn run moveweb // Moves the compiled files to out/src/web
        ```

</div>

<div id="api">

## <green>API</green>

The <aqua>API (src/api)</aqua> is the main API for the server.

It contains:

-   <aqua>src/api/api.ts</aqua> - The express router focused on configuring the API on startup. Includes: `Folder routing (Folders transform into routes)`, and `Web TypeScript routing (adds routes for the compiled web TypeScript)`

-   <aqua>src/api/routes</aqua> - The routes folder, which contains the routes for the API.

    Example of a route:
    <aqua>src/api/routes/weather/grab.ts</aqua>

    ```TS
    import { Request, Response } from 'express';
    import * as logger from '../../../utils/logger';

    export default (req: Request, res: Response) {
        logger.info('localhost:8000/weather/grab was requested');

        logger.infoWithStatusAndJson('Sending weather', res, 200, {
            weather: 'sunny',
            temperature: '20',
            temperatureUnit: 'F',
        });
    }
    ```

-   <aqua>src/api/database</aqua> - The database folder, which handles establishing a connection to the database. The app will only start once the database is connected.

</div>

</div>

# <aqua>License</aqua>

<a href="https://creativecommons.org/licenses/by-nc-nd/3.0/legalcode"><aqua>CC BY-NC-ND 3.0</aqua></a>

This project is licensed under the <a href="https://creativecommons.org/licenses/by-nc-nd/3.0/legalcode"><aqua>CC BY-NC-ND 3.0</aqua></a> license.
