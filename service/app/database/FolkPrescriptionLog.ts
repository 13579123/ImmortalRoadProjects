import {MysqlTable} from "../module/mysql/MysqlTable";
import {MysqlTableClass} from "../module/mysql/MysqlTableClass";
import {MysqlField} from "../module/mysql/MysqlField";
import { mysqlPool } from "../connection/mysql";

// 所有丹药记录
@MysqlTable({ mysqlPool: mysqlPool })
export class FolkPrescriptionLog extends MysqlTableClass {

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    comment: "炼药Code",
  })
  public code: string = ''

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    comment: "玩家email",
  })
  public email: string = ''

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    comment: "使用数量",
  })
  public useCount: number = 0

  @MysqlField({
    type: "TIMESTAMP",
    default: "now()",
    comment: "物品创建时间",
  })
  public createTime: Date = new Date

}