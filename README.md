# domvm-isomorphic-example
Trying to do a small example of server-side rendering with multiple routes.

This doesn't really work yet. And there's a little bit of hacky stuff going on.

## How to run

Requires the domvm repository in a sibling directory.

`git clone https://github.com/leeoniya/domvm.git`

`git clone https://github.com/grumpi/domvm-isomorphic-example.git`

`cd domvm-isomorphic-example`

`nodejs server.js`

## Status

* Server-side routing works with a hacky workaround of adding variables to the GLOBAL object of Nodejs.
* Client-side rehydration of the server-side rendered DOM works.

## Goals

* use mutation observers
* mock API calls that retrieve content
* include API request results in the rendered HTML