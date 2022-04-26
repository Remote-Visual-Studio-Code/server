# <span style="color: #12a3c6;">Remote Visual Studio Code</span> Server

Repository for the <span style="font-weight: bold">><span style="color: #12a3c6;">Remote Visual Studio Code</span></span> server.

## <span style="color: #0eb676;">Table of Contents</span>

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

# <span style="color: #12a3c6;">Usage</span>

<div id="installation">

## <span style="color: #0eb676;">Installation</span>

#### Install via Yarn

```bash
$ yarn install
```

#### Install via NPM

```bash
$ npm install
```

### Adding your `.env` file

<p><span style="font-weight: bold">$</span> node scripts/env.js

<span style="color: #0eb676;">? </span><span style="font-weight: bold">Enter a MongoDB URI: </span><span style="color: #12a3c6;">mongodb+srv://USERNAME:PASSWORD@DATABASE.rxwax.mongodb.net/DATABASE?retryWrites=true&w=majority</span>

<span style="color: #0eb676;">? </span><span style="font-weight: bold">Enter a port number: </span><span style="color: #12a3c6;">8000</span>

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

# <span style="color: #12a3c6;">Contributing</span>

This project is <span style="color: #12a3c6;">sperated</span> into a few sections.

<div id="backend">

## <span style="color: #0eb676;">Backend</span>

The main code for the server is in the <span style="color: #12a3c6;">src/server.ts</span> and the following folders:

-   <span style="color: #12a3c6;">src/api</span> - The API for the server.
-   <span style="color: #12a3c6;">src/models</span> - The models for the database of server.
-   <span style="color: #12a3c6;">src/utils</span> - Utility functions for the server.

</div>

<div id="frontend">

## <span style="color: #0eb676;">Frontend</span>

The frontend has two different parts:

-   <span style="color: #12a3c6;">src/pages</span> - The pages for the server.

    -   Routing for the UI. Each page has 2 files: a `meta` file, and a `ejs` file. The EJS file is the HTML file for the page, and the `meta` file tells the server what the page is, the route, title, meta tags, web typescript, css, javascript, and more.

    -   Example of a page:

    <span style="color: #12a3c6;">src/pages/data/index.ejs.json</span>

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
        // This code executes on the server
        "callback": "logger.info('Index loaded!', 'Router');" // The logger class is default imported for all callbacks
    }
    ```

    <span style="color: #12a3c6;">src/pages/pages/index.ejs</span>

    ```html
    <h1>Hello world!</h1>
    ```

-   <span style="color: #12a3c6;">src/ts</span> - Web Typescript files.
    -   Web TypeScript, or `bundles`, are TypeScript files that are compiled into a minfied file with a random name, for example: `_d85favsog.js`. Then they are assigned a route like `/api/bundle/_d85favsog.js`. The browser can then access them from their original names, listed as dependencies in their `meta` file.
    -   <span style="color: #12a3c6;">src/ts/min/minify.js</span> - A script that compiles and minfies all web TypeScript files.
        <br>
        Minify files:
        ```bash
        $ yarn run buildweb
        $ yarn run moveweb // Moves the compiled files to out/src/web
        ```

</div>

<div id="api">

## <span style="color: #0eb676;">API</span>

The <span style="color: #12a3c6;">API (src/api)</span> is the main API for the server.

It contains:

-   <span style="color: #12a3c6;">src/api/api.ts</span> - The express router focused on configuring the API on startup. Includes: `Folder routing (Folders transform into routes)`, and `Web TypeScript routing (adds routes for the compiled web TypeScript)`

-   <span style="color: #12a3c6;">src/api/routes</span> - The routes folder, which contains the routes for the API.

    Example of a route:
    <span style="color: #12a3c6;">src/api/routes/weather/grab.ts</span>

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

-   <span style="color: #12a3c6;">src/api/database</span> - The database folder, which handles establishing a connection to the database. The app will only start once the database is connected.

</div>

</div>

# <span style="color: #12a3c6;">License</span>

<a href="https://creativecommons.org/licenses/by-nc-nd/3.0/legalcode"><span style="color: #12a3c6;">CC BY-NC-ND 3.0</span></a>

This project is licensed under the <a href="https://creativecommons.org/licenses/by-nc-nd/3.0/legalcode"><span style="color: #12a3c6;">CC BY-NC-ND 3.0</span></a> license.
