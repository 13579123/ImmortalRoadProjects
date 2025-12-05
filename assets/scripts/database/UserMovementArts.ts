
const mysqlPool = null
class MysqlTableClass {}
const MysqlField: any = () => { return () => {} }
const MysqlTable: any = () => { return () => {} }

@MysqlTable({ mysqlPool: mysqlPool })
export class UserMovementArts extends MysqlTableClass {

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    comment: "招式对应玩家邮箱",
  })
  public email: string = ''

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    comment: "招式id",
  })
  public movementArtsId: number = 0

  @MysqlField({
    type: "TIMESTAMP",
    default: "now()",
    comment: "物品创建时间",
  })
  public createTime: Date = new Date

}