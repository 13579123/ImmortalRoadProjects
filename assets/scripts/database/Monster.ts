
const mysqlPool = null
class MysqlTableClass {}
const MysqlField: any = () => { return () => {} }
const MysqlTable: any = () => { return () => {} }

@MysqlTable({ mysqlPool: mysqlPool })
export class Monster extends MysqlTableClass {

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    isPrimary: true,
    autoIncrement: true,
    comment: "怪物对应的id",
  })
  public id: number = 0

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    comment: "怪物名称"
  })
  public name: string = ""

  @MysqlField({
    type: "TEXT",
    comment: "怪物简介"
  })
  public introduce: string = ""

  @MysqlField({
    type: "TEXT",
    comment: "怪物头像"
  })
  public avatarImage: string = ""

  @MysqlField({
    type: "INT",
    isUnsigned: true,
    comment: "怪物所在地图id"
  })
  public mapId: number = 0

  @MysqlField({
    type: "INT",
    isUnsigned: true,
    comment: "怪物所在地图x坐标 0 - 20"
  })
  public conditionX: number = 0

  @MysqlField({
    type: "INT",
    isUnsigned: true,
    comment: "怪物所在地图y坐标 0 - 20"
  })
  public conditionY: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    default: "5",
    comment: "怪物真气属性",
  })
  public power: number = 5

  @MysqlField({
    type: "INT",
    size: 4,
    default: "5",
    isUnsigned: true,
    comment: "怪物根骨属性 影响防御",
  })
  public bone: number = 5

  @MysqlField({
    type: "INT",
    size: 4,
    default: "5",
    isUnsigned: true,
    comment: "怪物体魄属性 影响生命",
  })
  public physique: number = 5

  @MysqlField({
    type: "INT",
    size: 4,
    default: "5",
    isUnsigned: true,
    comment: "怪物身法属性 影响出手速度和闪避率",
  })
  public movement: number = 5
  
  @MysqlField({
    type: "INT",
    default: '0',
    comment: "怪物是否是boss",
  })
  public isBoss: number = 0

  @MysqlField({
    type: "TEXT",
    comment: "怪物掉落物品JSON [{itemId: 0 , chance: 0 , number: [1,2,3]}]",
  })
  public dropJson: string = ""

  @MysqlField({
    type: "TIMESTAMP",
    default: "now()",
    comment: "物品创建时间",
  })
  public createTime: Date = new Date

}