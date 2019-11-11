import * as request from 'request'
import * as fs from 'fs'

export interface GameListEntry {
  id: number,
  modified: string,
  score: number
}

export const scrapeList = async () => {
  const gameList: GameListEntry[] = []
  let responseSize = 1
  let offset = 0
  while (responseSize > 0) {
    const r: any = await getGameFeed(offset)
    gameList.push(...r)
    responseSize = r.length ? r.length : 0
    offset += responseSize
  }

  return gameList
}

export const getGameFeed = (offset: number, limit = 50) => {
  return new Promise((resolve, reject) => {
    request(`https://api.ldjam.com/vx/node/feed/159347/smart+parent/item/game/compo+jam?offset=${offset}&limit=${limit}`, function (error, response, body) {
      if (error) {
        console.error('error:', error); // Print the error if one occurred
        reject(error)
      }
      if (body) {
        const b = JSON.parse(body)
        resolve(b.feed)
      }
    });
  });
}

export const getComments = (id: number) => {
  return new Promise<Comment[]>((resolve, reject) => {
    request(`https://api.ldjam.com/vx/comment/getbynode/${id}`, function (error, response, body) {
      if (error) {
        console.error('error:', error); // Print the error if one occurred
        reject(error)
      }
      if (body) {
        const comments: Comment[] = JSON.parse(body).note
        resolve(comments)
      }
    });
  });
}

export const getGameDetails = (gameId: number) => {
  return new Promise<GameDetails>((resolve, reject) => {
    request(`https://api.ldjam.com/vx/node2/get/${gameId}`, function (error, response, body) {
      if (error) {
        console.error('error:', error); // Print the error if one occurred
        reject(error)
      }
      if (body) {
        const data: GameDetails = JSON.parse(body).node[0]
        resolve(data)
      }
    });
  });
}

export interface GameDetails {
  id: number,
  parent: number,
  superparent: number,
  author: number,
  type: string,
  subtype: string,
  subsubtype: string,
  published: string,
  created: string,
  modified: string,
  version: number,
  slug: string,
  name: string,
  body: string,
  meta: {
    author: number[],
    cover: string,
    'grade-06-out': number,
    'grade-05-out': number,
    'link-01-tag': number,
    'link-02-tag': number,
    'link-03-tag': number,
    'link-01': string,
    'link-02': string,
    'link-03': string
  },
  path: string,
  parents: number[],
  love: number,
  notes: number,
  'notes-timestamp': number,
  grade: {
    'grade-01': number,
    'grade-02': number,
    'grade-03': number,
    'grade-04': number,
    'grade-07': number,
    'grade-08': number
  },
  magic:
  {
    cool: number,
    feedback: number,
    given: number,
    grade: number,
    smart: number
  }
}

export interface Comment {
  id: number,
  parent: number,
  node: number,
  supernode: number,
  author: number,
  created: string,
  modified: string,
  version: number,
  flags: number,
  body:
  string,
  love: number,
  'love-timestamp': string
}