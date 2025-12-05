import { NextFunction , Request , Response } from "express";
import { readFile } from "fs";
import path from "path";
import { ApiMap } from "./Api";

const document = () => {
  return async (req: Request , resp: Response , next: NextFunction) => {
    resp.setHeader('Content-Type', 'text/html')
    let template: string = await new Promise(res =>
      readFile(
        path.join(__dirname , "index.html") ,
        (err , data) => { res(data.toString()) }
      )
    )
    template = template.replace(/<\$api_map\$><\/\$api_map\$>/ig , JSON.stringify(ApiMap))
    resp.send(template)
  }
}

export const swagger = {
  document,
}