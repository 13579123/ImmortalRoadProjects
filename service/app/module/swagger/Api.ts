import { NextFunction, Request, Response } from "express"

type ApiOptions = {
  method: "GET"|"POST"|"PUT"|"DELETE"|"ANY",
  url: string,
  comment?: string,
  group?: string,
  requestExample?: any,
  headerExample?: any,
}

export const ApiMap: {[key: string]: ApiOptions[]} = {}

export const Api = (option: ApiOptions) => {
  let group = option.group || "default"
  let groupList: ApiOptions[]|void = ApiMap[group]
  if (!groupList) groupList = ApiMap[group] = []
  groupList.push(option)
  return (req: Request , resp: Response , next: NextFunction) => next()
}
