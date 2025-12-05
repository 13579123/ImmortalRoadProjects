import {MysqlTable} from "../module/mysql/MysqlTable";
import {MysqlTableClass} from "../module/mysql/MysqlTableClass";
import {MysqlField} from "../module/mysql/MysqlField";
import { mysqlPool } from "../connection/mysql";

@MysqlTable({ mysqlPool: mysqlPool })
export class Pack extends MysqlTableClass {

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    isPrimary: true,
    autoIncrement: true,
    comment: "物品堆对应的id",
  })
  public id: number = 0

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    comment: "物品对应的玩家邮箱",
  })
  public email: string = ""

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    comment: "物品对应的id",
  })
  public itemId: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    comment: "物品的数量",
  })
  public itemCount: number = 0

  @MysqlField({
    type: "INT",
    size: 1,
    isUnsigned: true,
    default: '0',
    comment: "是否已经装备",
  })
  public hasEquipment: number = 0

  @MysqlField({
    type: "TIMESTAMP",
    default: "now()",
    comment: "物品创建时间",
  })
  public createTime: Date = new Date

}