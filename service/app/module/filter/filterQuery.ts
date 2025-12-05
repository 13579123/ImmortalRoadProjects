import { NextFunction, Request, Response } from "express";
import CODE_RULE from "../CODE_RULE";

type QueryOption = {
  key: string,
  required?: boolean,
  failCode?: number,
  failResult?: any
}

export function filterQuery(queryOption: QueryOption[]) {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const query = req.query || {}
    for (let i = 0 ; i < queryOption.length ; i++) {
      const field = queryOption[i]
      if (query[field.key] === void 0 && field.required) {
        resp.status(field.failCode || CODE_RULE.ARGUMENT_ERROR)
        return resp.send(field.failResult)
      }
    }
    return next()
  }
}