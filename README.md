# Patient Assignment Tool v0.8

## Intro

This is a rewrite to use Supabase for database backend. It also handles state on the server.

JavaScript is easy for changing and managing the order of things. But it doesn't persist anything. Managing order in the database is difficult. 

This also allows for a small state object that can be kept with the Events, so the board can revert to prior states.

## Backend

`core` folder holds the guts of the application, managing state and database.

## API

### Board Functions
Aside from `board.get`, all the other methods return a `state` object. There is higher-order function wrapper that uses the `state` object to build a new `board` that is returned by `board.get()`.

The higher-order function in `board.js` passes in `board` as the first argument to each method.

#### &rarr; `board.get()`

**Returns**

> Returns the **board object**. `board.state` is small, only tracking IDs and order. `board.store` holds deeply nested objects returned from the database. Lots of records are repeated, e.g. `provider` is on each `shift` object but also in each `event` object. This makes render on the client end easy.

```javascript
{
  state: {
    main: [], // array of shift IDs
    flex: [], // array of shift IDs
    off: [], // array of shift IDs
    events: [], // array of event IDs, limit to 30
    nextFt: "", // shift ID
    nextProvider: "", // shift ID
    nextSupervisor: "", // shift ID
  },
  store: {
    main: [{}, {}, {}], // array of shift objects
    flex: [], //same
    off: [], //same
    events: [{}], // array of event objects
    nextFt: "shiftId",
    nextProvider: "shiftId",
    nextSupervisor: "shiftId",
  }
}
```

#### &rarr; `board.reset()`

> Resets the board and adds a reset event. This event can be undone as it keeps track of the last event, which is hold the state from before the reset.

#### &rarr; `board.undoEvent(event)`

**Parameters**

> `event` object from `board.store`.

#### &rarr; `board.addShift(providerId, scheduleId)`
#### &rarr; board.flexOn(shiftId);
#### &rarr; board.flexOff(shiftId);
#### &rarr; board.joinFt(shiftId);
#### &rarr; board.leaveFt(shiftId);
#### &rarr; board.signOut(shiftId);
#### &rarr; board.rejoin(shiftId);
#### &rarr; board.moveNext(whichNext, offset);
#### &rarr; board.moveShift(shiftId, offset);
#### &rarr; board.assignPatient(shift, type, room, advance);
#### &rarr; board.reassignPatient(event, newShift);

### Authentication

**Authentication** is handled with a minimal JWT implementation.

`/login` renders the login page that POSTS a form to `/login/password` that does the work of verifying the password against constant values stored in `.env`.

The `/checklogin` route is used for the frontend to make sure its token is up to date.

`authorization()` is Express middleware that checks the token and makes sure it is valid. If invalid it redirects to `/login`.

### API

The API runs off the functions in the controllers folder. The routes basically just map to controller functions.

The controllers are based on a simple functional pattern inspired by [this tutorial](https://dev.to/nas5w/learn-the-basics-of-redux-by-writing-your-own-version-in-30-lines-1if3). Originally used a reducer but realized that could be removed all together.

I tried to use a very functional approach. This should make each controller quite easy to understand. The controllers handle plain javascript objects. This means the whole board state can be stored in a JSON string. The functional approach also made testing _very_ easy. The controllers are well covered by unit tests.

The main `board.js` controller is **not** functional and uses a singleton pattern.

One unique feature is the `withHistory()` wrapper. This function is used to control which functions save a snapshot to the history stack.


### Socket.IO

All the clients stay in sync with **Socket.IO**. Using websockets means every client is subscribed to the server. The API endpoints don't have to return any site changes. After the API performs some action, the Socket.IO server just emits the new version of state.

## Frontend

The front end is just HTML/CSS/JS.

### HTML

The HTML is served by the Express server using EJS. EJS is used basically just to break the HTML down into chunks. It doesn't do any flow control, auth or higher level stuff.

### CSS

The CSS is just [Pico CSS v2](https://v2.picocss.com/). A very lightweight, nearly classless framework. Simple. Easy. Only made a few small modifications.

The `public` folder includes some SVG files that were necessary where the CSS used `background-image` to place icons in the timeline. They couldn't be added by EJS and are linked by URL.

### JS

The JS is run by Vue v3. The Vue instance doesn't require a build step. I followed the directions in the docs for the embedded setup. I originally had a Vite setup, running on a different port with proxies to connect front and back ends. Way to0 complicated for a simple site.

The first version of the site used `petite-vue`. This version uses the full thing. Vue handles the conditional rendering, flow control, etc.

I can't use single file components this way. But the amount of code required for each section of the site is fairly minimal and can be neatly organized into a single file with less than 300 lines of code.

The `dummy.js` and `dummy2.js` files are just dumps of the state from server. Used for development. Useful to see the shape of content from server. That's why I'm leaving them here.

## Docs
The `client/docs` folder holds markdown files for the Quick Reference section of the website. There is one route in the express server that dynamically fetches the markdown files and uses the `docs.ejs` templates for the boilerplate code. [This was the reference tutorial](https://dev.to/khalby786/creating-a-markdown-blog-with-ejs-express-j40).

Any new Markdown pages need to be added to the `docs_sidenav.ejs` partial.
