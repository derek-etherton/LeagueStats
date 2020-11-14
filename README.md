
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
