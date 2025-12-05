import {MysqlTable} from "../module/mysql/MysqlTable";
import {MysqlTableClass} from "../module/mysql/MysqlTableClass";
import {MysqlField} from "../module/mysql/MysqlField";
import { mysqlPool } from "../connection/mysql";

@MysqlTable({ mysqlPool: mysqlPool })
export class Role extends MysqlTableClass {

  @MysqlField({
    type: "INT",
    size: 4,
    comment: "id",
    isPrimary: true,
    autoIncrement: true
  })
  public id: number = 0

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    comment: "身世名称",
  })
  public role: string = ""

  @MysqlField({
    type: "INT",
    size: 4,
    default: "0",
    comment: "玩家真气属性",
  })
  public power: number = 5

  @MysqlField({
    type: "INT",
    size: 4,
    default: "0",
    comment: "玩家根骨属性 影响防御",
  })
  public bone: number = 5

  @MysqlField({
    type: "INT",
    size: 4,
    default: "0",
    comment: "玩家体魄属性 影响生命",
  })
  public physique: number = 5

  @MysqlField({
    type: "INT",
    size: 4,
    default: "0",
    comment: "玩家身法属性 影响出手速度和闪避率",
  })
  public movement: number = 5

  @MysqlField({
    type: "INT",
    size: 4,
    default: "0",
    comment: "玩家灵力属性 影响暴击概率",
  })
  public wakan: number = 5

  @MysqlField({
    type: "INT",
    size: 4,
    default: "0",
    comment: "玩家悟性 影响修炼速度",
  })
  public comprehension: number = 5

  @MysqlField({
    type: "INT",
    size: 4,
    default: "0",
    comment: "玩家机缘 影响灵力获取速度",
  })
  public luck: number = 5

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    comment: "简介",
  })
  public introduce: string = ""

  @MysqlField({
    type: "TIMESTAMP",
    default: "now()",
    comment: "身世出现时间",
  })
  public createTime: Date = new Date

}