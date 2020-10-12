(Hosted at [engine-game.com](https://engine-game.com))

You'll need Node version >=14.
Run the server with `node index.js`.
The source is mostly in index.ts, public/main.ts and public/logic.ts.
To compile you'll need typescript, which you can get with `npm install -g typescript` and run with `tsc -p .`.

If you want to connect to a database (to test or make changes to the scoreboard system), you'll need to:

* Run a postgres database.
* Populate the database with the appropriate tables. I should write a script for doing that, ping me if you want it.
* Create a `.env` file with contents like `DATABASE_URL=postgres://paulfchristiano@localhost/deckbuilding`
* Get Heroku and run the app with it.
* Or skip the last two steps and just replace `process.env.DATABASE_URL` in index.ts with the appropriate URL.

I'm not expecting anyone to do that. 
