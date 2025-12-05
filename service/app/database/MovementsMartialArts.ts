import {MysqlTable} from "../module/mysql/MysqlTable";
import {MysqlTableClass} from "../module/mysql/MysqlTableClass";
import {MysqlField} from "../module/mysql/MysqlField";
import { mysqlPool } from "../connection/mysql";

@MysqlTable({ mysqlPool: mysqlPool })
export class MovementMatialArts extends MysqlTableClass {

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    isPrimary: true,
    autoIncrement: true,
    comment: "招式id",
  })
  public id: number = 0

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    isUnique: true,
    default: "''",
    comment: "招式编码",
  })
  public code: string = ''

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    default: "''",
    comment: "招式名称",
  })
  public name: string = '化气为形'

  @MysqlField({
    type: "TEXT",
    comment: "招式简介",
  })
  public introduce: string = '以气攻击，造成100%攻击力的伤害'

  @MysqlField({
    type: "TEXT",
    comment: "招式图标",
  })
  public icon: string = ''

  @MysqlField({
    type: "INT",
    isUnsigned: true,
    default: "0",
    comment: "招式等级",
  })
  public level: number = 0

  @MysqlField({
    type: "TIMESTAMP",
    default: "now()",
    comment: "物品创建时间",
  })
  public createTime: Date = new Date

}