# Patient Assignment Tool v0.2

## Intro

This is a ground up rewrite of the first version. Key things: manages state just on the server, no database, seemed unnecessary.

## Backend

`index.js` is the entry point for an Express.js server.

### Authentication

**Authentication** is handled with a minimal JWT implementation.

`/login` renders the login page that POSTS a form to `/login/password` that does the work of verifying the password against constant values stored in `.env`.

The `/checklogin` route is used for the frontend to make sure its token is up to date.

`authorization()` is Express middleware that checks the token and makes sure it is valid. If invalid it redirects to `/login`.

### API

The API runs off the functions in the controllers folder. The routes basically just map to controller functions.

The controllers are based on a simple functional pattern inspired by [this tutorial](https://dev.to/nas5w/learn-the-basics-of-redux-by-writing-your-own-version-in-30-lines-1if3). Originally used a reducer but realized that could be removed all together.

I tried to use a very functional approach. This should make each controller quite easy to understand. One unique feature is the `withHistory()` wrapper. This function is used to control which functions save a snapshot to the history stack.

The functional approach also made testing _very_ easy. The controllers are well covered by unit tests.

### SOCKET.IO

All the clients stay in sync with **Socket.IO**. Using websockets means every client is subscribed to the server. The API endpoints don't have to return any site changes. After the API performs some action, the Socket.IO server just emits the new version of state.

## Frontend

The front end is just HTML/CSS/JS.

### HTML

The HTML is served by the Express server using EJS. EJS is used basically just to break the HTML down into chunks. It doesn't do any flow control, auth or higher level stuff.

### CSS

The CSS is just [Pico CSS v2](https://v2.picocss.com/). A very lightweight, nearly classless framework. Simple. Easy. Only made a few small modifications.

### JS

The JS is run by Vue v3. The Vue instance doesn't require a build step. I followed the directions in the docs for the embedded setup. I originally had a Vite setup, running on a different port with proxies to connect front and back ends. Way to complicated for a simple site.

The first version of the site used `petite-vue`. This version uses the full thing. Vue handles the conditional rendering, flow control, etc.

I can't use single file components this way. But the amount of code required for each section of the site is fairly minimal and can be neatly organized into a single file with less than 300 lines of code.

The `dummy.js` and `dummy2.js` files are just dumps of the state from server. Used for development. Useful to see the shape of content from server. That's why I'm leaving them here.
