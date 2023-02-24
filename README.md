# Site Outage Monitor

The intended purpose of this codebase is to monitor the global stream of all outages, filtering for a specific site, enriching this data and posting it to the specific sites list of outages. It is also to land me a job at a wicked tech and climate action organisation.


## How to run
This program runs on the terminal, you can use `npm run start:mock` to spin up a mock KrakenFlex server, and then have the program run against it. Or you can setup an .env file at the root of the repo (in the shape at the bottom of the README) and use `npm start` to run it using that.

Alternatively, you can set the environment variables with the command itself. See the `start:mock` command for an example. Finally, you can run `npm run mock` in one terminal session, and `npm run run:mock` in another to see the constituent parts of `start:mock` in action.

## How to test
Run the command `npm run test` to run the Unit Tests, and `npm run test:int` for the singular (To prove the concept) integration test.

## Architecture and tech choices
Other than an API URL and key, the application also needs two other inputs to run. That is the site you want to update, and the cutoff time you want to filter outages by. This is so a history of runs can be kept for each site, and the same program used to update a given (every) site with outages since the last runtime.


I've tried to be as module as is reasonable, allowed for ample mocking and isolation in the Unit Tests. There is one Unit Test in particular though that i'm sure will cause debate! It is the exact opposite of "implementation agnostic", but i'd love to talk to you about why I did it.


I used dyson mocks as the local mock server as I know it well enough and it's easy to spin up without Docker, no other reason. If I was doing this "properly" I'd use [Mock Server](https://hub.docker.com/r/mockserver/mockserver) something I have a _lot_ of experience with, using to write Integration Tests.

I also created an environment variable util, with defaults. The only input truly needed is the API_KEY. Without anymore, it will just call the real KrakenFlex API using the tech test requested cutoff date and target site.

## Improvements
I spent more time than I should on this, but there is still more i'd like to do
- Finish all unit tests, not just the examples
- The promises for getting the data could be combined and run at the same time
- When data enters the system (Responses form the API), it should be validated to confirm to the expected shape. This could be done with [Joi](https://www.npmjs.com/package/joi) for example.
- The main function could be called on a loop, so that the site was continuously updated. The loop could set a timeout, or could using something like [limiter](https://www.npmjs.com/package/limiter) to handle RPS limits. Or or, for more Platform level visibility and IaC control, this program could stay how it is, and be run on a cloud cronjob
- Dockerize it! Easy, but still more time than not doing it. Also unlocks more representative Integration Testing, where when combined with Mock Server, you can assert based on the requests sent to the 3rd party APIs to ensure you maintain your contract with them  (What, Contract Testing too? Calm down)
- Add TypeScript to the tests. Only reason I didn't is because mocking modules is more challenging in the TS Jest world and I didn't want to spend too much time on this Tech Test fiddling with config. I'd rather tell you I did think of it, but cut the scope.
- A better logging solution. Something classic, like [Winston](https://www.npmjs.com/package/winston), or even [bunyan](https://www.npmjs.com/package/bunyan). This would be essential to productionize the code.
- Add a failure scenario for the Integration Test!



### example .env
```bash
KRAKEN_FLEX_KEY=**KEY_HERE**
KRAKEN_FLEX_API_BASE_URL=https://api.krakenflex.systems/interview-tests-mock-api/v1 # Run against KrakenFlex
# KRAKEN_FLEX_API_BASE_URL=http://localhost:3000 # Run against dyson mocks
OUTAGE_CUTTOFF_DATE=2022-01-01T00:00:00.000Z
SITEID_TO_CHECK=NORWICH_PEAR_TREE
```
