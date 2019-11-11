import * as request from 'request'
import { scrapeList, GameListEntry, getGameFeed } from './scrape/ldSite'
import { writeFile } from 'fs'
import * as sqlite3 from 'sqlite3'
// test()
t()

function t() {
  const db = new sqlite3.Database('data/ldData.db')
}

async function test() {
  const gameList: GameListEntry[] = []
  let responseSize = 1
  let offset = 0
  while (responseSize > 0) {
    const r: any = await getGameFeed(offset)
    gameList.push(...r)

    responseSize = r.length ? r.length : 0
    offset += responseSize
  }
  writeFile('data/gameList.json', JSON.stringify(gameList), (err) => {
    console.log(err)
  })
}