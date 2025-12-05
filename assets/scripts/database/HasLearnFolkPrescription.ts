
const mysqlPool = null
class MysqlTableClass {}
const MysqlField: any = () => { return () => {} }
const MysqlTable: any = () => { return () => {} }

@MysqlTable({ mysqlPool: mysqlPool })
export class HasLearnFolkPrescription extends MysqlTableClass {

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    comment: "已经学习的炼药Code",
  })
  public code: string = ''

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    comment: "玩家email",
  })
  public email: string = ''

  @MysqlField({
    type: "TIMESTAMP",
    default: "now()",
    comment: "物品创建时间",
  })
  public createTime: Date = new Date

} 