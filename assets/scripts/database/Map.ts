
const mysqlPool = null
class MysqlTableClass {}
const MysqlField: any = () => { return () => {} }
const MysqlTable: any = () => { return () => {} }

@MysqlTable({ mysqlPool: mysqlPool })
export class Map extends MysqlTableClass {

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    comment: "地图id",
    autoIncrement: true,
    isPrimary: true,
  })
  public id: number = 0

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    default: "''",
    comment: "地图名称",
  })
  public name: string = ""

  @MysqlField({
    type: "TEXT",
    comment: "地图简介",
  })
  public introduce: string = ""

  @MysqlField({
    type: "TEXT",
    comment: "地图图片",
  })
  public mapImage: string = ""

  @MysqlField({
    type: "INT",
    size: 4,
    comment: "地图位置",
  })
  public mapLevel: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    comment: "地图所属世界",
  })
  public mapWorld: number = 0

  @MysqlField({
    type: "INT",
    isUnsigned: true,
    comment: "地图开始位置",
    default: '0'
  })
  public startX: number = 0

  @MysqlField({
    type: "INT",
    isUnsigned: true,
    comment: "地图开始位置",
    default: '0'
  })
  public startY: number = 0

  @MysqlField({
    type: "TIMESTAMP",
    default: "now()",
    comment: "物品创建时间",
  })
  public createTime: Date = new Date

}