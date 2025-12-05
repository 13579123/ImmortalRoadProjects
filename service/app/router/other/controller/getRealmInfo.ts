import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import CODE_RULE from "../../../module/CODE_RULE";
import { getSuccess } from "../../../util/result";

dotenv.config()

export function getRealmInfo() {

  return async (req: Request , resp: Response , next: NextFunction) => {
    const result = getSuccess(CODE_RULE.SUCCESS , "获取成功" , {
      // 境界
      realm: "炼气、筑基、结丹、元婴、化神、练虚、合体、大乘、天仙、玄仙、太乙玉仙、大罗金仙、入道、明道、悟道、化道".split("、"),
      // 身体境界
      bodyRealm: "淬体、通脉、锻骨、炼腑、元武、金身、大成、神力、仙体、破虚、混元、道体".split("、"),
      // 灵根境界
      spiritRootRealm: "废品、凡品、人品、玄品、灵品、地品、天品、极品、仙品、道品".split('、'),
    })
    resp.send(result)
  }

}