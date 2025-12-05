
const mysqlPool = null
class MysqlTableClass {}
const MysqlField: any = () => { return () => {} }
const MysqlTable: any = () => { return () => {} }

@MysqlTable({ mysqlPool: mysqlPool })
export class Sect extends MysqlTableClass {

  @MysqlField({
    type: "INT",
    comment: "宗门id",
    isPrimary: true,
    isNull: false,
    autoIncrement: true,
  })
  public id: number = 0

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    comment: "宗门名称",
    isNull: false,
  })
  public name: string = ""

  @MysqlField({
    type: "INT",
    default: "1",
    comment: "宗门的星级",
  })
  public level: number = 0

  @MysqlField({
    type: "TEXT",
    comment: "宗门的角色列表 JSON [{ name: string, introduce: string, icon: string }]",
  })
  public roleListJson: string = '[]'

  @MysqlField({
    type: "TEXT",
    comment: "宗门贡献点商店物品列表 JSON [{itemId: 0 , spend: 0}]",
  })
  public contributeItemListJson: string = "[]"

  @MysqlField({
    type: "TEXT",
    comment: "宗门商店的物品 JSON [{itemId: 0 , spend: [{itemId: 0 , count: 1}]}]",
  })
  public shopItemListJson: string = "[]"

  @MysqlField({
    type: "TIMESTAMP",
    default: "now()",
    comment: "宗门出现的时间",
  })
  public createTime: Date = new Date

}