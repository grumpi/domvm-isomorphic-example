# domvm-isomorphic-example
Trying to do a small example of server-side rendering with multiple routes.

This doesn't really work yet. And there's a little bit of hacky stuff going on.

Status:

* Server-side routing works with a hacky workaround of adding variables to the GLOBAL object of Nodejs.
* Client-side rehydration of the server-side rendered DOM doesn't work for some reason.