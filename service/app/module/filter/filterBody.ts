import { NextFunction, Request, Response } from "express";
import CODE_RULE from "../CODE_RULE";

type BodyOption = {
  key: string,
  required?: boolean,
  default?: any,
  type?: "string"|"number"|"any",
  failResult?: any,
}

export function filterBody(bodyOption: BodyOption[]) {
  return async (req: Request , resp: Response , next: NextFunction) => {
    const body = req.body || {}
    for (let i = 0 ; i < bodyOption.length ; i++) {
      const field = bodyOption[i]
      let value = body[field.key]
      if (value === void 0) value = body[field.key] = field.default
      if (field.required && value === void 0) {
        resp.status(CODE_RULE.ARGUMENT_ERROR)
        return resp.send(field.failResult || {})
      }
      if (value === void 0) break;
      if (field.type !== "any" && field.type) {
        if (typeof value !== field.type) {
          resp.status(CODE_RULE.ARGUMENT_ERROR)
          return resp.send(field.failResult || {})
        }
      }
    }
    return next()
  }
}