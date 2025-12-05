
const mysqlPool = null
class MysqlTableClass {}
const MysqlField: any = () => { return () => {} }
const MysqlTable: any = () => { return () => {} }

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