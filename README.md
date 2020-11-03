# LeagueStats
Sample League of Legends stats app for Battlefy. While this app was bootstrapped with create-react-app, it does not use a ServiceWorker.

# Lessons Learned
- Error-handling should be built-in from the start
- It's painfully easy to deploy to Heroku, and it's also straightforward to grab a completed front-end and have a node server serve it up
- 4 hours is not a lot of time to build a full-stack application, and my development processes on my home computer have a lot of room for improvement (IDE Plugins, linting, autocomplete)
- There is significant value to having a back-end that acts as middleware to another API beyond just obscuring your secrets
- Even for a 4-hour coding challenge, it is worth putting together some prototypes for your main object types to assist with autocomplete and save time looking at docs and large json objects

# How I would approach this differently next time
I think my basic approach to develop the backend first, then build the frontend on top was quite effective both in terms of avoiding context switching, and isolating issues as they came up. Since I knew the backend was returning the data I needed, I knew that errors on the frontend were largely isolated to that part of the code. On the backend, I created a number of methods to break down the task of getting a users' full game details which I also found to be effective. I did waste a small bit of time creating some api endpoints I knew I wouldn't use because I had that functionality written up anyways, but were I to do it again I would've left those endpoints out, since the time crunch definitely caught up to me. On the front-end, my plan to have two main components (one MatchList containing several MatchCards) still seems good to me, but the methods I used to process the provided match data were not very effective. Next time, I would definitely create an over-arching data processor method or class, which would fetch from the API and work through this match data logic independently before sending it through to the views. The last thing I would do differently is lay out data prototypes or at least some sample data JSONs in a very clear way before beginning work, because the amount of time I spent re-referencing bulky JSON objects was far too high. 

# How would I handle exceeding the rate limiting threshold on Riot Games' API?
Compliments of LeagueJS, [RiotRateLimiter](https://github.com/Colorfulstan/RiotRateLimiter-node) is already being used to gracefully avoid rate limits using a SPREAD strategy. Some other ways to prevent hitting the limit in the first place, are:
1. Use An API Gateway (e.g. Amazon) to throttle requests, which is possible on both server-side (a bit redundant with LeagueJS) and client-side. I would definitely set per-client throttling limits to prevent single individuals from disproportionately polling against our API.
2. Use a WAF (Web Application Firewall) to secure our API against common attacks, and provide further visibility into individuals who may be over-consuming the API.
3. Use API Gateway Caching to reduce the number of duplicated calls to our API. This would take some experimentation to balance getting up-to-date results with reducing our calls to the Riot API. Something as basic as a 5 minute cache could help with bursts of interest, while something closer to a 1-hour policy may help absorb the bulk of 'popular player' queries.
4. And a more obvious one: Improve the UI to prevent accidental and/or redundant requests.
**If the limit was reached,** then we should have a mechanism in place (LeagueJS currently) which detects the rate limit response code (429) and re-attempts the request on an increasing interval (i.e. 1s, 3s, 5s, ..), before eventually showing the user an error. This approach of ramping up the time between retries should help alleviate the pressure in the case that many requests are simultaneously retrying.

# How would I architect a solution that works on production at scale?
On a code level, aside from a plethora of code quality improvements (some outlined in 'next steps'), I would consider pulling apart the frontend and backend code so they could be developed and deployed separately. This has the benefit of allowing us to deploy one without the other, while also offering the portability to one day interchange components, or have another application use the same backend. From this perspective, we would have a static website (the react frontend) which makes calls to the API as if it was an external service.

From there, the **front-end** setup is very simple, we have a CDN (i.e. Cloudfront) which sits in front of an S3 bucket containing our static web content (i.e. the 'built' React app), and so our domain name routes to CDN which routes to S3. Since we're using a CDN I don't believe the front-end needs any sort of load balancing or firewall magic.

The **back-end** can be deployed on EC2s, with a load balancer in front to ensure resiliency. In front of that, we should put an API Gateway, and if desired we could wrap it all up in a WAF.

Here is a basic diagram I threw together in Lucid Chart:
![Architecture Diagram](https://raw.githubusercontent.com/derek-etherton/LeagueStats/main/leagueStats.png)

# Next Steps, or "if I had two more hours"
Though not a provided question, I did want to outline next steps for this application to be useable:
- API Error handling; the API is currently very fragile and prone to errors even when receiving 'expected' but invalid user input, this should be quick to fix.
- Client error handling: Once the API is working better, the client should display appropriate error messages based on the returned status codes.
- Static data integration: I only had the chance to look up champion names, this must be done for Items and Summoners as well, then translated to the appropriate image content
- API & UI Responsiveness: Currently match requests are performed synchronously and blocked until all matches are received, this should be streamed instead, or at minimum the frontend needs to put up a loading indicator
- Code Structure: api.js is doing a lot of work that should be handled in other areas, as outlined in the docstring headers. Promises should be used in a few places to clean up the callback messiness.
