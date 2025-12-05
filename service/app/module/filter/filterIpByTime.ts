import { NextFunction, Request, Response } from "express";
import CODE_RULE from "../CODE_RULE";
import { getFail } from "../../util/result";

type FilterType = {
  flashTime?: number,
  requestCount?: number,
}

export function filterIpByTime(filter: FilterType = {}) {
  let lastTime = 0
  let IpTimes: { [ip: string]: number } = {}

  const time = filter.flashTime || 10
  const requestCount = filter.requestCount || 10
  return async (req: Request , resp: Response , next: NextFunction) => {
    const now = Date.now()
    const ip = req.ip as string
    if ((now - lastTime) / 1000 > time) {
      IpTimes = {}
      lastTime = now
    }
    if (IpTimes[ip] === void 0) IpTimes[ip] = requestCount
    if (IpTimes[ip] <= 0) return resp.send(getFail(CODE_RULE.SUCCESS , '请求太频繁了，稍等一下吧'))
    IpTimes[ip] = IpTimes[ip] - 1
    next()
  }
}