
const mysqlPool = null
class MysqlTableClass {}
const MysqlField: any = () => { return () => {} }
const MysqlTable: any = () => { return () => {} }

@MysqlTable({ mysqlPool: mysqlPool })
export class Account extends MysqlTableClass {

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    comment: "用户邮箱",
    isPrimary: true,
  })
  public email: string = ""

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    comment: "用户昵称" 
  })
  public nickname: string = "" 

  @MysqlField({
    type: "INT",
    size: 1,
    default: "0",
    comment: "用户账号是否被冻结",
  })
  public frozen: 0|1 = 0

  @MysqlField({
    type: "TIMESTAMP",
    default: "now()",
    comment: "用户注册时间",
  })
  public createTime: Date = new Date

}