import {createClient} from 'redis'

type Option = {
  url: string,
  database?: number,
}

export function getRedis(option: Option = {url: 'redis://127.0.0.1:6379'}) {

  let hasReady = false , awaitTask: Function[] = []

  const redisClient = createClient(option)
  
  redisClient.connect()
  
  redisClient.on("ready" , () => {
    console.log("redis connect has ready " + option.url)
    hasReady = true
    awaitTask.forEach(c => c())
  })

  return {
    async get(key: string) {
      if (!hasReady) await new Promise(res => awaitTask.push(res))
      return await redisClient.get(key)
    },
    async set(key: string , value: any , time?: number) {
      if (!hasReady) await new Promise(res => awaitTask.push(res))
      await redisClient.set(key , value)
      if (time) redisClient.expire(key , time)
    },
    async del(key: string) {
      if (!hasReady) await new Promise(res => awaitTask.push(res))
      return await redisClient.del(key)
    },
  }
}