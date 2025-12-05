import {MysqlTable} from "../module/mysql/MysqlTable";
import {MysqlTableClass} from "../module/mysql/MysqlTableClass";
import {MysqlField} from "../module/mysql/MysqlField";
import { mysqlPool } from "../connection/mysql";

// 所有兑换码
@MysqlTable({ mysqlPool: mysqlPool })
export class RedeemCode extends MysqlTableClass {

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    isUnique: true,
    comment: "兑换Code",
    isPrimary: true,
  })
  public code: string = ''

  @MysqlField({
    type: 'TEXT',
    comment: '奖励JSON'
  })
  public rewardsJson: string = '[{itemId: 0 , count: 0}]'

  @MysqlField({
    type: 'BIGINT' ,
    default: '-1',
    comment: '有效时间 -1为永久'
  })
  public effectTime: number = -1

  @MysqlField({
    type: 'INT' ,
    default: '-1',
    comment: '可用次数'
  })
  public useTime: number = -1

  @MysqlField({
    type: "TIMESTAMP",
    default: "now()",
    comment: "物品创建时间",
  })
  public createTime: Date = new Date

}