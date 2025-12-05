import {MysqlTable} from "../module/mysql/MysqlTable";
import {MysqlTableClass} from "../module/mysql/MysqlTableClass";
import {MysqlField} from "../module/mysql/MysqlField";
import { mysqlPool } from "../connection/mysql";

@MysqlTable({ mysqlPool: mysqlPool })
export class MethodExercises extends MysqlTableClass {

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    isPrimary: true,
    autoIncrement: true,
    comment: "功法对应的id",
  })
  public id: number = 0

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    default: "'垃圾功法'",
    comment: "功法名称"
  })
  public name: string = "垃圾功法" 

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    default: "''",
    comment: "功法简介"
  })
  public introduce: string = "随处可见的功法" 

  @MysqlField({
    type: "INT",
    size: 10,
    default: "1",
    comment: "功法级别 凡阶 人阶 地阶 天阶 神阶 仙阶 道阶" 
  })
  public level: number = 1

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    default: "0",
    comment: "玩家真气属性",
  })
  public power: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    default: "0",
    isUnsigned: true,
    comment: "玩家根骨属性 影响防御",
  })
  public bone: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    default: "0",
    isUnsigned: true,
    comment: "玩家体魄属性 影响生命",
  })
  public physique: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    default: "0",
    isUnsigned: true,
    comment: "玩家身法属性 影响出手速度和闪避率",
  })
  public movement: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    default: "0",
    isUnsigned: true,
    comment: "玩家灵力属性 影响暴击概率",
  })
  public wakan: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    default: "5",
    isUnsigned: true,
    comment: "玩家悟性 影响修炼速度",
  })
  public comprehension: number = 5

  @MysqlField({
    type: "INT",
    size: 4,
    default: "0",
    isUnsigned: true,
    comment: "玩家机缘 影响灵力获取速度",
  })
  public luck: number = 0


  @MysqlField({
    type: "TIMESTAMP",
    default: "now()",
    comment: "玩家开始修行的时间",
  })
  public createTime: Date = new Date

}