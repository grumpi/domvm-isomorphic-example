# domvm-isomorphic-example
Trying to do a small example of server-side rendering with multiple routes using https://github.com/leeoniya/domvm.

This doesn't really work yet. And there's a little bit of hacky stuff going on.

## How to run

Requires the domvm repository in a sibling directory.

`git clone https://github.com/leeoniya/domvm.git`

`git clone https://github.com/grumpi/domvm-isomorphic-example.git`

`cd domvm-isomorphic-example`

`nodejs server.js`

## Status

* Server-side routing works with a somewhat hacky workaround of adding variables to the GLOBAL object of Nodejs. TODO: This is not necessarily thread-safe. As soon as something async happens between setting and using these global variables, they might get overwritten.
* Client-side rehydration of the server-side rendered DOM would work, but there is a catch: as soon as there's some kind of data-binding for input elements, the input elements get reset when the client attaches and redraws. I haven't figured out a way to get the value from the input in the server-rendered DOM to a variable in the app. Inputs that don't have data-binding retain their value when the client attaches. In the current state of the example, I wipe the DOM and mount the app on an empty body when the client starts to run.
* the nodejs server in this example serves both the data API and the SPA.
* `store/` provides an interface for fetching from the data API from either client or server.
* the nodejs server collects data needed for the context of the route that is served and includes that in the rendered HTML.
* the SPA client initializes the cache with the inlined data included in the server-rendered HTML.
