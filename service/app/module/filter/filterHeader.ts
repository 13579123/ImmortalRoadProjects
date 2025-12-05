import { NextFunction, Request, Response } from "express";
import CODE_RULE from "../CODE_RULE";

type HeaderOption = {
  key: string,
  required?: boolean,
  failResult?: any,
  failCode?: number
}

export function filterHeader(bodyOption: HeaderOption[]) {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const header = req.headers || {}
    for (let i = 0 ; i < bodyOption.length ; i++) {
      const field = bodyOption[i]
      const value = header[field.key]
      if (field.required && value === void 0) {
        resp.status(field.failCode || CODE_RULE.ARGUMENT_ERROR)
        return resp.send(field.failResult)
      }
      if (value === void 0) break;
    }
    return next()
  }
}