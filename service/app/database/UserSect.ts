import {MysqlTable} from "../module/mysql/MysqlTable";
import {MysqlTableClass} from "../module/mysql/MysqlTableClass";
import {MysqlField} from "../module/mysql/MysqlField";
import { mysqlPool } from "../connection/mysql";

export type ShopItem = {
  itemId: number
  spend: Array<{itemId: number , count: number}>
}

export type Role = {
  name: string
  introduce: string
  icon: string
}

@MysqlTable({ mysqlPool: mysqlPool })
export class UserSect extends MysqlTableClass {

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    isPrimary: true,
    comment: "用户邮箱",
  })
  public email: string = ''

  @MysqlField({
    type: "INT",
    comment: "所在宗门id",
  })
  public sectId: number = 0

  @MysqlField({
    type: "INT",
    isUnsigned: true,
    comment: "宗门职位 0 外门弟子 1 内门弟子 2 亲传弟子 3 宗门长老 4 宗门门主",
  })
  public sectPosition: number = 0

  @MysqlField({
    type: "INT",
    isUnsigned: true,
    comment: "宗门贡献点",
  })
  public sectContribute: number = 0

  @MysqlField({
    type: "TIMESTAMP",
    default: "now()",
    comment: "加入宗门时间",
  })
  public createTime: Date = new Date

}