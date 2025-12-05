
const mysqlPool = null
class MysqlTableClass {}
const MysqlField: any = () => { return () => {} }
const MysqlTable: any = () => { return () => {} }

@MysqlTable({ mysqlPool: mysqlPool })
export class Item extends MysqlTableClass {

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    comment: "物品id",
    autoIncrement: true,
    isPrimary: true,
  })
  public id: number = 0

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    comment: "物品名称",
  })
  public name: string = ''

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    comment: "物品简介",
  })
  public introduce: string = ''

  @MysqlField({
    type: "TEXT",
    comment: "物品icon图片路径",
  })
  public icon: string = ''

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    comment: "物品最大堆叠数量",
  })
  public maxCount: number = 0

  @MysqlField({
    type: "INT",
    size: 1,
    default: '1',
    comment: "可以使用",
  })
  public canUse: number = 1

  @MysqlField({
    type: "INT",
    size: 1,
    default: '1',
    comment: "可以出售",
  })
  public canSell: number = 1

  @MysqlField({
    type: "INT",
    size: 4,
    default: '1',
    comment: "物品出售价值",
  })
  public price: number = 1

  @MysqlField({
    type: "INT",
    size: 1,
    default: '0',
    comment: "物品是否是装备",
  })
  public isEquipment: number = 1

  @MysqlField({
    type: "TEXT",
    comment: "物品额外数据",
  })
  public extraDataJson: string = 'null'

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    isNull: true,
    default: 'null',
    comment: "类型",
  })
  public equipmentType: "weapon"|"helmet"|"clothes"|"shoes"|null = null

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    isNull: true,
    default: "''",
    comment: "物品代号",
    isUnique: true,
  })
  public code: string = ''

  @MysqlField({
    type: "TIMESTAMP",
    default: "now()",
    comment: "物品创建时间",
  })
  public createTime: Date = new Date

}