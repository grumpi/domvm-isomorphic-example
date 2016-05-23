# domvm-isomorphic-example
A smallish example of server-side rendering with multiple routes using https://github.com/leeoniya/domvm.

## How to run

Requires the domvm repository in a sibling directory.

`git clone https://github.com/leeoniya/domvm.git`

`git clone https://github.com/grumpi/domvm-isomorphic-example.git`

`cd domvm-isomorphic-example`

`nodejs server.js`

## Status

* Server-side routing works with a somewhat hacky workaround of adding variables to the GLOBAL object of Nodejs. TODO: This is not necessarily thread-safe. As soon as something async happens between setting and using these global variables, they might get overwritten.
* When the client starts to run, the server-rendered DOM is wiped and the client renders anew.
* `store/` provides an interface for fetching from the data API from either client or server.
* the nodejs server in this example serves both the data API and the SPA. In a realistic situation, it's likely that the data API is served by a separate server. For that, we can send requests to the data API server in `store/index.js` instead of reading data from the resource-variable.
* the nodejs server collects data needed for the context of the route that is served and includes that in the rendered HTML.
* the SPA client caches what it got from the `store/` for a few seconds.
* the SPA client initializes its cache with the inlined data included in the server-rendered HTML.


### Rehydration of the Server-Rendered DOM?

Client-side rehydration of the server-side rendered DOM seems to work when what the client needs to render is sufficiently close to what the server rendered. Kudos to domvm's capabilities of attaching to the existing DOM.

What I noticed: as soon as I'm naively doing data-binding for input elements (like in the contact list example), the value of the input element gets reset when the client attaches. Reason: I didn't initialize the variable associated with the value of the input element with the value of the input in the existing DOM.

I haven't figured out a good way to get the value from the input in the server-rendered DOM to a variable in the app. My impression is that, sure, this is possible to do, but then we're starting to go down a slope of doing more or less clever hacks.

Practical consideration: When you render on the server, I think it's not uncommon that you want to render things differently on the server than on the client - and if it's just to let the user know that the page was rendered on the server and there's more stuff loading. This means that your server-rendered DOM differs from the client-rendered DOM. This can result in domvm being unable to attach to the existing DOM.

That's what got me to the point where I thought "oh well, in my case it's really just fine if people cannot interact until the Single-Page-Application is loaded". In this use case, it makes sense to render differently between server and client, in such a way that the user already sees the input elements that will become active when the Single-Page-Application is up and running.

## Story / Philosophy

### What's this Isomorphism Business?

The term "isomorphism" is (mis-)used in the JavaScript community to mean something like "running the same (or almost same) code on the server and in the users' browser".

**Why would you even want to do that? Isn't having huge, interactive "Single-Page" JavaScript applications running entirely in the browser all the rage these days?**

Some considerations commonly brought up:

1. Search engine indexing of content in the Single-Page-Application. This seems to be less relevant nowadays since the major search engines seem to run the JavaScript and, thus, index what is rendered by the Single-Page-Application. Search engines that don't run JavaScript won't index the information to be found under the URLs of the Single-Page-Application.
2. Graceful degradation. As in, letting people on less cpable browsing agents (which are not supported by the Single-Page-Application) peruse content and, possibly, some of the interactive features of the Single-Page-Application. When the user's browser can't run the Single-Page-Application, that can be a problem.
3. "Time to first content". How long it takes to see what's on the page when you click a link leading from the rest of the web to some content in the Single-Page-Application. Naively set-up Single-Page-Applications are notorious for first having to load their own JavaScript, running that, then having to go for another roundtrip (or several) to the server(s) to fetch the actual content. This is **slow**. Whether this initial slowness is perceived as a minor nuisance or a major headache depends on the user's connection.

**So, if Single-Page-Applications are so horrible, why do people even build them in the first place?**

Advantages of Single-Page-Applications:

1. faster loading of content while using less bandwith when the Single-Page-Application is running. When the user switches to another URL inside the Single-Page-Application, there's no page reload. Instead, the application just fetches exactly the data needed to render the page associated with the URL.
2. ease of adding offline-use support to the application.
3. ease of developing complex, interactive views.

### Progressive Enhancement vs. Graceful Degradation

These are two sides of the same coin: Starting from an empty glass, filling it up or starting from a full glass pouring things out.

There seems to be no substantial difference between the difficulty of 

1. adding to a no-JavaScript HTML website until it can behave exactly like a rich, interactive Single-Page-Application and
2. adding to a Single-Page-Application until it can behave exactly like a no-JavaScript HTML website.

Going from full to empty, or from empty to full are both either very difficult or time-consuming to do. The time-consuming way is to create a separate no-JavaScript HTML website and a Single-Page-Application for the different user bases.

Not going all the way seems less involved.

It's not hard to add capabilities to a Single-Page-Application stack that allow rendering HTML pages on the server so that users on all kinds of browsing agents can see the content inside the Single-Page-Application.

It's not hard to enhance a basic HTML website with a little JavaScript that makes input elements fancier / more usable, or by having it load partial pages by AJAX.

Where you want to start comes down to what is valued more:

1. the ability to be used by as many people as possible, or
2. the ability to provide a rich, interactive experience at low development/maintenance cost to those who can use the site.

For my purposes, though, the philosophical/ideological discussion around graceful degradation versus progressive enhancement is of little importance. I see the point of an "Isomorphic Single-Page-Application" in...

### Making a good first impression

You follow a link promising cat pictures in your browser and 
* (scenario 1) end up on a screen that tells you that things are loading. And it keeps loading... and loading... and loading because you're on a bad/slow connection. You close the tab and are annoyed.
* (scenario 2) end up on a blank screen (due to a JavaScript error) or, if you're lucky and the developer(s) considered this, a graciously provided error screen because your browser isn't supported by the leet Single-Page-Application. You close the tab and are annoyed. If you waited for everything to download on your bad connection just to see this, you're really, seriously annoyed.
* (scenario 3) get to see the content you were looking for immediately (because the server ran the JavaScript application to render a HTML page for the URL you requested, instead of just dumping you a content-less HTML page that loads and runs the JavaScript application). You get an idea right away whether the application behind this content might be worth the wait / browser upgrade.

To turn scenario 3 in a decent experience, we need to add the following:

1. a loading indicator that shows how loading the app progresses - so that the user can decide whether it makes sense to wait for it on their connection.
2. something that tells the user when their browser isn't supported by the Single-Page-Application, kindly asking them to switch to or upgrade to a supported browser if they want to use the interactive elements of the application.
3. If their browser isn't supported, we really shouldn't even have their browser start downloading the application.
