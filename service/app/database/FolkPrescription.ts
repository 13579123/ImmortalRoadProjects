import {MysqlTable} from "../module/mysql/MysqlTable";
import {MysqlTableClass} from "../module/mysql/MysqlTableClass";
import {MysqlField} from "../module/mysql/MysqlField";
import { mysqlPool } from "../connection/mysql";

// 所有丹药/炼器公式
@MysqlTable({ mysqlPool: mysqlPool })
export class FolkPrescription extends MysqlTableClass {

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    isUnique: true,
    comment: "炼药Code",
    isPrimary: true,
  })
  public code: string = ''

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    comment: "需要物品的id",
  })
  public materialsMainItem: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    comment: "需要物品的数量",
  })
  public materialsMainItemNumber: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    comment: "需要物品的id",
  })
  public materialsOtherItem: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    comment: "需要物品的数量",
  })
  public materialsOtherItemNumber: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    comment: "产出物品的id",
  })
  public exportItemId: number = 0
  
  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    comment: "产出物品的最小数量",
  })
  public min: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    comment: "产出物品的最大数量",
  })
  public max: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    default: '0',
    comment: "炼丹 0 炼器 1",
  })
  public type: number = 0

  @MysqlField({
    type: "TIMESTAMP",
    default: "now()",
    comment: "物品创建时间",
  })
  public createTime: Date = new Date

}