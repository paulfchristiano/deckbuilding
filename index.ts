import express from 'express'
import path from 'path'
const PORT = process.env.PORT || 5000
import {verifyScore, VERSION } from './public/logic.js'

import postgres from 'postgres'
const sql = postgres(process.env.DATABASE_URL)

//TODO: get rid of these any's
//TODO: this is probably horribly insecure

function randomString(): string {
    return Math.random().toString(36).substring(2, 7)
}

function renderTimeSince(date:Date) {
    let secondsAgo:number = ((new Date()).getTime() - date.getTime()) / 1000;
    const units:[string, number][] = [
        ["year", 31536000],
        ["month", 2592000],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
        ["second", 1],
    ]
    for (const [unitName, unitSize] of units) {
        const unitsAgo = Math.floor(secondsAgo / unitSize)
        if (unitsAgo > 1) return `${unitsAgo} ${unitName}s ago`
    }
    return 'Just now'
}

async function ensureNextMonth(): Promise<void> {
    const d:Date = new Date()
    for (let i = 0; i < 30; i++) {
        const secret = randomString()
        const datestring = renderEastCoastDate(d)
        const results = await sql`
            INSERT INTO dailies (datestring, secret) values (${datestring}, ${secret})
            ON CONFLICT DO NOTHING
        `
        d.setDate(d.getDate() + 1)
    }
}

function renderEastCoastDate(inputDate:Date|null = null): string {
    const d:Date = (inputDate == null) ? new Date() : new Date(inputDate)
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset() - 240)
    return d.toLocaleDateString().split('/').join('.')
}

async function dailySeed(): Promise<string> {
    const datestring:string = renderEastCoastDate()
    while (true) {
        const results = await sql`
          SELECT secret FROM dailies
          WHERE datestring=${datestring}
        `
        if (results.length == 0) {
            await ensureNextMonth()
        }
        else {
            return `${datestring}.${results[0].secret}`
        }
    }
}

express()
    .use(express.static('./public'))
    .set('view engine', 'ejs')
    .set('views', './views')
    .get('/topScore', async (req:any, res:any) => {
      try {
          const seed = req.query.seed
          const version = req.query.version
          if (version != VERSION) {
              res.send('version mismatch')
              return
          }
          //TODO: include only scores for the current version
          const results = await sql`
              SELECT username, score, submitted FROM scoreboard
              WHERE seed=${seed} AND version=${version}
              ORDER BY score ASC, submitted ASC
          `
          if (results.length == 0)
              res.send('none')
          else
              res.send(results[0].score.toString())
      } catch(err) {
          console.error(err);
          res.send('Error: ' + err);
      }
    })
    .get('/scoreboard', async (req:any, res:any) => {
      try {
          const seed = req.query.seed
          const results = await sql`
              SELECT username, score, submitted, version FROM scoreboard
              WHERE seed=${seed}
              ORDER BY version DESC, score ASC, submitted ASC
          `
          const entries = results.map((x:any) => ({...x, timesince:renderTimeSince(x.submitted)}))
          const entriesByVersion: [string, object[]][] = [];
          for (const entry of entries) {
              if (entriesByVersion.length == 0) {
                  entriesByVersion.push([entry.version, [entry]] as [string, object[]])
              } else {
                  let lastVersion:[string, object[]] = entriesByVersion[entriesByVersion.length-1]
                  if (lastVersion[0] != entry.version) {
                      lastVersion = [entry.version, []]
                      entriesByVersion.push(lastVersion)
                  }
                  lastVersion[1].push(entry)
              }
          }
          res.render('pages/scoreboard', {entriesByVersion:entriesByVersion, seed:seed, currentVersion:VERSION});
      } catch(err) {
          console.error(err);
          res.send('Error: ' + err);
      }
    })
    .get('/play', async (req:any, res:any) => {
        try {
            res.render('pages/main', {seed:undefined})
        } catch(err) {
            console.error(err);
            res.send(err)
        }
    })
    .get('/', async (req:any, res:any) => {
        try {
            res.render('pages/main', {seed:undefined})
        } catch(err) {
            console.error(err);
            res.send('Error: ' + err);
        }
    })
    .get('/daily', async (req:any, res:any) => {
        try {
            const seed = await dailySeed()
            res.render('pages/main', {seed:seed})
        } catch(err) {
            console.error(err);
            res.send('Error: ' + err);
        }
    })
    .post('/submit', async (req:any, res:any) => {
        try {
            const seed = req.query.seed
            const score = req.query.score
            const username = req.query.username
            const history = req.query.history
            const [valid, explanation] = await verifyScore(seed, history, score)
            if (valid) {
                const results = await sql`
                  INSERT INTO scoreboard (username, score, seed, version)
                  VALUES (${username}, ${score}, ${seed}, ${VERSION})
                `
                res.send(`OK`)
            } else {
                res.send(`Score did not validate: ${explanation}`)
            }
        } catch(err) {
          console.error(err);
          res.send('Error: ' + err);
        }
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))
