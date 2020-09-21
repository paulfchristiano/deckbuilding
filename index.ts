import express from 'express'
import path from 'path'
const PORT = process.env.PORT || 5000
import {verifyScore, VERSION, specFromURL, specToURL } from './public/logic.js'
import {Credentials, hashPassword, CampaignInfo} from './public/campaign.js'

import postgres from 'postgres'
const sql = (process.env.DATABASE_URL == undefined) ? null : postgres(process.env.DATABASE_URL)

//TODO: get rid of these any's
//TODO: this is probably horribly insecure
//TODO: fix parameter parsing

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

function renderTime(date:Date) {
  return date.toLocaleString('en-US', {timeZone: 'America/New_York'})
}

async function signup(credentials:Credentials): Promise<void> {
  await sql`INSERT INTO campaign_users (name, password_hash)
           VALUES (
             ${credentials.username},
             ${credentials.hashedPassword}
  )`
}

//TODO: deal with the login logic
async function userExists(credentials:Credentials): Promise<boolean> {
  const results = await sql`SELECT * FROM campaign_users
    WHERE name=${credentials.username}
    AND password_hash=${credentials.hashedPassword}`
  return (results.length > 0)
}


async function ensureNextMonth(): Promise<void> {
    if (sql == null) return
    const d:Date = new Date()
    for (let i = 0; i < 30; i++) {
        for (const type of dailyTypes) {
          const key = makeDailyKey(type, d)
          let secret:string;
          const results = await sql`SELECT secret FROM secrets WHERE key=${key}`
          if (results.length == 0) {
            secret = randomString();
            await sql`INSERT INTO secrets (key, secret)
                                  VALUES (${key}, ${secret})
                      ON CONFLICT DO NOTHING`
          } else {
            secret = results[0].secret
          }
          await sql`
              INSERT INTO dailies (type, key, secret, url)
                          values (${type}, ${key}, ${secret}, ${makeDailyURL(key, secret)})
              ON CONFLICT DO NOTHING
          `
        }
        d.setDate(d.getDate() + 1)
    }
}

type DailyType = 'weekly' | 'daily'
const dailyTypes:DailyType[] = ['weekly', 'daily']

function makeDailyKey(type:DailyType, inputDate:Date|null=null): string {
  const d:Date = (inputDate == null) ? new Date() : new Date(inputDate)
  //TODO: this seems like a bad way to handle timezones...
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset() - 240) //east coast time
  switch (type) {
    case 'weekly':
      //new weekly challenges only at beginning of Monday
      while (d.getDay() != 1) d.setDate(d.getDate() - 1)
      return d.toLocaleDateString().split('/').join('.')
    case 'daily':
      return d.toLocaleDateString().split('/').join('.')
  }

}

async function dailyURL(type:DailyType): Promise<string> {
    const key:string = makeDailyKey(type)
    if (sql == null) return makeDailyURL(key, 'offline')
    while (true) {
        const results = await sql`
          SELECT secret FROM secrets
          WHERE key=${key}
        `
        if (results.length == 0) {
            await ensureNextMonth()
        }
        else {
            return makeDailyURL(key, results[0].secret)
        }
    }
}

function makeDailyURL(key:string, secret:string) {
  return `seed=${key}.${secret}`
}

async function submitForDaily(username:string, url:string, score:number): Promise<void> {
    if (sql == null) return;
    for (const type of dailyTypes) {
      if (url == await dailyURL(type)) {
        await sql`
            UPDATE dailies
            SET best_user = ${username}, best_score=${score}, version=${VERSION}
            WHERE url = ${url} AND type = ${type} AND
                (version = ${VERSION} OR version ISNULL) AND
                (best_score > ${score} OR best_score ISNULL)
        `
      }
    }
} 

type RecentEntry = {version:string, age:string, score:number, username:string, url:string}

async function serveMain(req:any, res:any) {
    try {
          res.render('pages/main', {url:undefined, tutorial:false})
      } catch(err) {
          console.error(err);
          res.send(err.toString())
      }
}


function dailyTypeFromReq(req:any): DailyType {
  let typeString:string|undefined = req.query.type
  let type:DailyType|undefined = undefined;
  for (const dailyType of dailyTypes) {
    if (typeString == dailyType) type = dailyType
  }
  if (typeString === undefined) type = 'daily';
  if (type === undefined) throw Error(`Invalid daily type ${typeString}`)
  return type
}

async function serveDailyByType(type:DailyType, res:any) {
    try {
        const url = await dailyURL(type)
        res.render('pages/main', {url:url, tutorial:false})
    } catch(err) {
        console.error(err);
        res.send(err.toString())
    }
}

async function serveWeekly(req:any, res:any) {
  await serveDailyByType('weekly', res)
}

async function serveDaily(req:any, res:any) {
    try {
        const type:DailyType = dailyTypeFromReq(req)
        await serveDailyByType(type, res)
    } catch(err) {
        console.error(err);
        res.send(err.toString())
    }
}

async function freeToSpoil(url:string) {
  for (const type of dailyTypes) {
    const dailyURLs:string[] = await Promise.all(dailyTypes.map(dailyURL))
    return dailyURLs.every(x => x != url)
  }
}

async function serveDailiesByType(type:DailyType, res:any) {
  try {
      //TODO: this assumes that key is a date, remove assumption
      // (does alphabetical just work fine?)
      const results = await sql`
          SELECT key, url, version, best_score, best_user, type,
                 to_date(key, 'MM.DD.YYYY') as date
          FROM dailies
          WHERE type = ${type}
          ORDER BY date DESC
      `
      for (const result of results)
          results.current = (result.version == VERSION)
      res.render('pages/dailies', {type:type, dailies:results.filter((r:any) => r.best_user != null)})
    } catch(err) {
        console.error(err);
        res.send(err.toString())
    }
}

async function serveTutorial(req:any, res:any) {
  res.render('pages/main', {url:undefined, tutorial:true})
}

function last<T>(xs:T[]): T {
  return xs[xs.length -1]
}

//TODO: if you guess a locked level you can play it and get points
//probably better to just make it impossible to submit until unlocked?
async function getCampaignInfo(
  username:string,
  cheat:boolean=false
): Promise<CampaignInfo> {
  console.log('Cheating: ' + cheat)
  const scores = await sql`SELECT level, score, username
    FROM campaign_scores WHERE username = ${username}`
  const scoreByLevel:Map<string, number> = new Map()
  for (const row of scores) {
    scoreByLevel.set(row.level, row.score)
  }
  const awards = await sql`SELECT level, threshold, core
    FROM campaign_awards`
  const passedLevels:Set<string> = new Set()
  const awardsByLevels:Map<string, number> = new Map()
  let numAwards:number = 0
  for (const row of awards) {
    const score:number|undefined = scoreByLevel.get(row.level)
    if (score !== undefined) {
      if (row.threshold >= score) {
        numAwards += 1
        awardsByLevels.set(row.level, (awardsByLevels.get(row.level)||0) + 1)
        if (row.core) passedLevels.add(row.level)
      }
    }
  }
  const lockedLevels:Map<string, string[]> = new Map()
  const requirements = await sql`SELECT destination, req FROM campaign_requirements`
  for (const row of requirements) {
    if (!passedLevels.has(row.req)) {
      const currentReqs:string[] = lockedLevels.get(row.destination) || []
      lockedLevels.set(row.destination, currentReqs.concat([row.req]))
    }
  }
  const levels = await sql`SELECT key, url, points_required from campaign_levels`
  const urls:[string, string][] = []
  const lockReasons:[string, string][] = []
  //TODO: show both points and level dependencies
  for (const row of levels) {
    const req:string[]|undefined = lockedLevels.get(row.key)
    if (numAwards < row.points_required) {
      lockReasons.push([row.key, `${row.points_required} points`])
    } else if (req !== undefined) {
      lockReasons.push([row.key, `${req.join(',')}`])
    } 
    if ((numAwards >= row.points_required && !lockedLevels.has(row.key)) || cheat) {
      urls.push([row.key, row.url])
    }
  }
  return {
    urls: urls,
    lockReasons: lockReasons,
    scores: scores.map((r:any) => [r.level, r.score]),
    awardsByLevels: Array.from(awardsByLevels.entries()),
    numAwards:numAwards
  }
}

express()
    .use(express.static('./public'))
    .set('view engine', 'ejs')
    .set('views', './views')
    .get('/campaignInfo', async (req: any, res:any) => {
      const credentials:Credentials = {
        username:req.query.username,
        hashedPassword:req.query.hashedPassword
      }
      if (!userExists(credentials)) {
        res.send('error')
      } else {
        const cheat = req.query.cheat !== undefined;
        const info = await getCampaignInfo(credentials.username, cheat)
        res.send(info)
      }
    })
    .post('/signup', async (req: any, res:any) => {
      const credentials:Credentials = {
        username:req.query.username,
        hashedPassword:req.query.hashedPassword
      }
      if (credentials.username.length < 1) {
        res.send('Non-empty username required')
      } else if (credentials.hashedPassword.length < 1) {
        res.send("Non-empty password hash required (shouldn't be possible)")
      } else {
        try {
          await signup(credentials)
          res.send('ok')
        } catch (e) {
          res.send(e)
        }
      }
    })
    .post('/login', async (req: any, res:any) => {
      const credentials:Credentials = {
        username:req.query.username,
        hashedPassword:req.query.hashedPassword
      }
      try {
        const success:boolean = await userExists(credentials)
        if (success) {
          res.send('ok')
        } else {
          res.send('username+password not found')
        }
      } catch (e) {
        res.send(e)
      }
    })
    .get('/link', async (req: any, res:any) => {
      const id = req.query.id;
      try{
        const results = await sql`
          INSERT INTO links (id, url)
          VALUES (${id}, ${decodeURIComponent(req.query.url)})
        `
        res.send('ok')
      } catch(err) {
        res.send(err)
      }
    })
    .get('/g/:id', async (req:any, res:any) => {
      const results = await sql`
        SELECT id, url FROM links
        WHERE id=${req.params.id}
      `
      if (results.length < 1) {
        res.send("link not found")
      } else {
        res.redirect(`../${results[0].url}`)
      }
    })
    .get('/campaignHeartbeat', async (req:any, res:any) => {
      const credentials:Credentials = {
        username:req.query.username,
        hashedPassword:req.query.hashedPassword
      }
      const success:boolean = await userExists(credentials)
      if (!success) {
        res.send('user not found')
        return
      }
      const version = req.query.version
      if (version != VERSION) {
          res.send('version mismatch')
          return
      }
      const username = credentials.username
      const url = decodeURIComponent(req.query.url)
      const scores = await sql`SELECT s.score
        FROM campaign_scores s
        JOIN campaign_levels l ON s.level = l.key
        WHERE l.url = ${url} AND s.username = ${username} `
      const score = (scores.length > 0) ? scores[0].score : NaN
      const awards = await sql`SELECT a.threshold
        FROM campaign_awards a
        JOIN campaign_levels l ON a.level = l.key
        WHERE l.url = ${url}`
      let nextAward = NaN
      for (const award of awards) {
        if ((award.threshold < score || isNaN(score))
          && (award.threshold > nextAward || isNaN(nextAward))){
          nextAward = award.threshold
        }
      }
      res.send([score, nextAward])
    })
    .post('/campaignSubmit', async (req:any, res:any) => {
      const credentials:Credentials = {
        username:req.query.username,
        hashedPassword:req.query.hashedPassword
      }
      const success:boolean = await userExists(credentials)
      if (!success) {
        res.send('user not found')
        return
      }
      const username = credentials.username
      const url = decodeURIComponent(req.query.url)
      const spec = specFromURL(url)
      const score = req.query.score
      const history = req.query.history
      //TODO: verify custom games, probably use URL here and everywhere in file?
      const [valid, explanation] = await verifyScore(spec, history, score)
      if (!valid) {
        res.send(`Score did not validate: ${explanation}`)
        return
      }
      const levels = await sql`SELECT key
        FROM campaign_levels WHERE url=${url}`
      if (levels.length == 0) {
        res.send('campaign level not found')
      }
      const key = levels[0].key
      const scores = await sql`SELECT score
        FROM campaign_scores
        WHERE level = ${key} and username=${username}`
      let newAwards = 0;
      await sql`INSERT INTO campaign_scores (username, level, score)
        VALUES (${username}, ${key}, ${score})
        ON CONFLICT ON CONSTRAINT only_top
        DO UPDATE SET score = LEAST(campaign_scores.score, ${score})`
      const oldScore = (scores.length > 0) ? scores[0].score : NaN
      const awards = await sql`SELECT threshold
        FROM campaign_awards
        WHERE level = ${key}`
      let nextAward = NaN
      for (const award of awards) {
        const threshold = award.threshold
        if (threshold < score
            && (threshold < oldScore || isNaN(oldScore))
            && (threshold > nextAward || isNaN(nextAward))){
          nextAward = threshold
        } else if ((threshold < oldScore || isNaN(oldScore))
                && threshold >= score) {
          newAwards += 1
        }
      }
      res.send({priorBest:oldScore, newAwards:newAwards, nextAward:nextAward})
    })
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
          res.send(err.toString())
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
              LIMIT 100
          `

          const recents:RecentEntry[] = results.map((result:any) => ({
                  url:result.url,
                  version:result.version,
                  age:renderTime(result.submitted),
                  score:result.score,
                  username:result.username
              }))
          res.render('pages/recent', {recents:recents})
      } catch(err) {
          console.error(err);
          res.send(err.toString())
      }
    })
    .get('/dailies', async (req:any, res:any) => {
      try {
          if (sql == null) {
              res.send('Not connected to a database')
              return
          }
          let type:DailyType = dailyTypeFromReq(req)
          await serveDailiesByType(type, res)
      } catch(err) {
          console.error(err);
          res.send(err.toString())
      }
    })
    .get('/weeklies', async (req: any, res:any) => {
      await serveDailiesByType('weekly', res)
    })
    .get('/scoreboard', async (req:any, res:any) => {
      try {
          const url = decodeURIComponent(req._parsedUrl.query)
          if (sql == null) {
              res.send('Not connected to a database.')
              return
          }
          const results = await sql`
              SELECT username, score, submitted, version, history FROM scoreboard
              WHERE url=${url}
              ORDER BY version DESC, score ASC, submitted ASC
          `
          const spoilers = await freeToSpoil(url)
          const entries = results.map((x:any) => ({
            ...x,
            time:x.submitted,
            renderedTime:renderTime(x.submitted),
            history: spoilers ? x.history : ''
          }))
          const entriesByVersion: [string, object[]][] = [];
          let bestTime:any = null
          for (const entry of entries) {
              if (entriesByVersion.length == 0) {
                  entriesByVersion.push([entry.version, []])
              } else if (last(entriesByVersion)[0] != entry.version) {
                  entriesByVersion.push([entry.version, []])
                  bestTime = null
              }
              if (bestTime === null || bestTime > entry.time) {
                  bestTime = entry.time
                  entry['leader'] = true
              } else {
                  entry['leader'] = false
              }
              const versionEntries:any[] = last(entriesByVersion)[1]
              versionEntries.push(entry)
          }
          res.render('pages/scoreboard', {entriesByVersion:entriesByVersion, url:url, currentVersion:VERSION});
      } catch(err) {
          console.error(err);
          res.send(err.toString())
      }
    })
    .get('/random', serveMain)
    .get('/play', serveMain)
//    .get('/', serveDaily)
    .get('/daily', serveDaily)
    .get('/weekly', serveWeekly)
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
            const username = decodeURIComponent(req.query.username)
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
          res.send(err.toString())
        }
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))
