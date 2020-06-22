import express from 'express'
import path from 'path'
const PORT = process.env.PORT || 5000
import {verifyScore, VERSION, specFromURL, specToURL } from './public/logic.js'

import postgres from 'postgres'
const sql = (process.env.DATABASE_URL == undefined) ? null : postgres(process.env.DATABASE_URL)

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
    if (sql == null) return
    const d:Date = new Date()
    for (let i = 0; i < 30; i++) {
        const secret = randomString()
        const datestring = renderEastCoastDate(d)
        const results = await sql`
            INSERT INTO dailies (datestring, secret, url)
                        values (${datestring}, ${secret}, ${makeDailyURL(datestring, secret)})
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

async function dailyURL(): Promise<string> {
    const datestring:string = renderEastCoastDate()
    if (sql == null) return datestring
    while (true) {
        const results = await sql`
          SELECT url FROM dailies
          WHERE datestring=${datestring}
        `
        if (results.length == 0) {
            await ensureNextMonth()
        }
        else {
            return results[0].url
        }
    }
}

function makeDailyURL(datestring:string, secret:string) {
    return `seed=${datestring}.${secret}`
}

async function submitForDaily(username:string, url:string, score:number): Promise<void> {
    if (sql == null) return;
    await sql`
        UPDATE dailies
        SET best_user = ${username}, best_score=${score}, version=${VERSION}
        WHERE url = ${url} AND
            (version = ${VERSION} OR version ISNULL) AND
            (best_score > ${score} OR best_score ISNULL)
    `
} 

type RecentEntry = {version:string, age:string, score:number, username:string, url:string}

async function serveMain(req:any, res:any) {
    try {
          res.render('pages/main', {url:undefined, tutorial:false})
      } catch(err) {
          console.error(err);
          res.send(err)
      }
}

async function serveDaily(req:any, res:any) {
    try {
        const url = await dailyURL()
        res.render('pages/main', {url:url, tutorial:false})
    } catch(err) {
        console.error(err);
        res.send('Error: ' + err);
    }
}

async function serveTutorial(req:any, res:any) {
  res.render('pages/main', {url:undefined, tutorial:true})
}

express()
    .use(express.static('./public'))
    .set('view engine', 'ejs')
    .set('views', './views')
    .get('/topScore', async (req:any, res:any) => {
      try {
          if (sql == null) {
              res.send('none')
              return
          }
          const url = decodeURIComponent(req.query.url)
          const version = req.query.version
          if (version != VERSION) {
              res.send('version mismatch')
              return
          }
          const results = await sql`
              SELECT username, score, submitted FROM scoreboard
              WHERE url=${url} AND version=${version}
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
    .get('/recent', async (req:any, res:any) => {
      try {
          if (sql == null) {
              res.send('Not connected to a database')
              return
          }
          const results = await sql`
              SELECT username, score, submitted, url, version FROM scoreboard
              ORDER BY submitted DESC
          `
          const recents:Map<string, RecentEntry> = new Map()
          for (const result of results) {
              const oldBest:RecentEntry|undefined = recents.get(result.url)
              if (oldBest != undefined && oldBest.score > result.score && oldBest.version == result.version) {
                  recents.delete(result.url)
              }
              if (!recents.has(result.url)) {
                  recents.set(result.url, {
                      url:result.url,
                      version:result.version,
                      age:renderTimeSince(result.submitted),
                      score:result.score,
                      username:result.username
                  })
              }
          }
          res.render('pages/recent', {recents:Array.from(recents.values())})
      } catch(err) {
          console.error(err);
          res.send('Error: ' + err);
      }
    })
    .get('/dailies', async (req:any, res:any) => {
      try {
          if (sql == null) {
              res.send('Not connected to a database')
              return
          }
          const results = await sql`
              SELECT datestring, url, version, best_score, best_user,
                     to_date(datestring, 'MM.DD.YYYY') as date
              FROM dailies
              ORDER BY date DESC
          `
          for (const result of results)
              results.current = (result.version == VERSION)
          res.render('pages/dailies', {dailies:results.filter((r:any) => r.best_user != null)})
      } catch(err) {
          console.error(err);
          res.send('Error: ' + err);
      }
    })
    .get('/scoreboard', async (req:any, res:any) => {
      try {
          const url = req._parsedUrl.query
          if (sql == null) {
              res.send('Not connected to a database.')
              return
          }
          const results = await sql`
              SELECT username, score, submitted, version FROM scoreboard
              WHERE url=${url}
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
          res.render('pages/scoreboard', {entriesByVersion:entriesByVersion, url:url, currentVersion:VERSION});
      } catch(err) {
          console.error(err);
          res.send('Error: ' + err);
      }
    })
    .get('/random', serveMain)
    .get('/play', serveMain)
    .get('/', serveDaily)
    .get('/daily', serveDaily)
    .get('/tutorial', serveTutorial)
    .post('/submit', async (req:any, res:any) => {
        try {
            if (sql == null) {
                res.send('Not connected to db.')
                return
            }
            const url = decodeURIComponent(req.query.url)
            const spec = specFromURL(url)
            const score = req.query.score
            const username = req.query.username
            const history = req.query.history
            //TODO: verify custom games, probably use URL here and everywhere in file?
            const [valid, explanation] = await verifyScore(spec, history, score)
            if (valid) {
                const results = await sql`
                  INSERT INTO scoreboard (username, score, url, version, history)
                  VALUES (${username}, ${score}, ${url}, ${VERSION}, ${history})
                `
                await submitForDaily(username, url, score)
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
