import {MysqlTable} from "../module/mysql/MysqlTable";
import {MysqlTableClass} from "../module/mysql/MysqlTableClass";
import {MysqlField} from "../module/mysql/MysqlField";
import { mysqlPool } from "../connection/mysql";

// 所有兑换码
@MysqlTable({ mysqlPool: mysqlPool })
export class RedeemCodeLog extends MysqlTableClass {

  @MysqlField({
    type: "VARCHAR",
    size: 255,
  })
  public code: string = ''

  @MysqlField({
    type: "VARCHAR",
    size: 255,
  })
  public email: string = ''

  @MysqlField({
    type: "TIMESTAMP",
    default: "now()",
    comment: "物品创建时间",
  })
  public createTime: Date = new Date

}