import {MysqlTable} from "../module/mysql/MysqlTable";
import {MysqlTableClass} from "../module/mysql/MysqlTableClass";
import {MysqlField} from "../module/mysql/MysqlField";
import { mysqlPool } from "../connection/mysql";

@MysqlTable({ mysqlPool: mysqlPool })
export class UserProperty extends MysqlTableClass {

  @MysqlField({
    type: "VARCHAR",
    size: 255,
    comment: "玩家对应的邮箱",
    isPrimary: true,
  })
  public email: string = ""

  @MysqlField({
    type: "INT",
    size: 4,
    comment: "玩家对应的角色id",
    default: "1",
  })
  public roleId: number = 1

  @MysqlField({
    type: "INT",
    size: 1,
    comment: "玩家对应的性别 1 为男 2 为女",
    default: "1",
  })
  public sex: number = 1

  @MysqlField({
    type: "INT",
    size: 4,
    comment: "渡劫成功率",
    default: "100",
  })
  public hijackRate: number = 100

  @MysqlField({
    type: "BIGINT",
    comment: "玩家自动修炼",
    default: "0",
  })
  public autoCultivation: number = 0

  @MysqlField({
    type: "BIGINT",
    isUnsigned: true,
    default: "0",
    comment: "玩家修为",
  })
  public exp: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    default: "5",
    comment: "玩家真气属性",
  })
  public power: number = 5

  @MysqlField({
    type: "INT",
    size: 4,
    default: "5",
    isUnsigned: true,
    comment: "玩家根骨属性 影响防御",
  })
  public bone: number = 5

  @MysqlField({
    type: "INT",
    size: 4,
    default: "5",
    isUnsigned: true,
    comment: "玩家体魄属性 影响生命",
  })
  public physique: number = 5

  @MysqlField({
    type: "INT",
    size: 4,
    default: "5",
    isUnsigned: true,
    comment: "玩家身法属性 影响出手速度和闪避率",
  })
  public movement: number = 5

  @MysqlField({
    type: "INT",
    size: 4,
    default: "5",
    isUnsigned: true,
    comment: "玩家灵力属性 影响暴击概率",
  })
  public wakan: number = 5

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
    default: "5",
    isUnsigned: true,
    comment: "玩家机缘 影响灵力获取速度",
  })
  public luck: number = 5

  @MysqlField({
    type: "INT",
    size: 4,
    default: "0",
    isUnsigned: true,
    comment: "玩家肉体境界 通脉、锻骨、炼腑、元武、神力、破虚、混元、大成、仙体、金身、道体",
  })
  public bodyRealm: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    default: "0",
    comment: "玩家肉体小境界 0 - 9 阶",
  })
  public bodyDetailRealm: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    default: "0",
    comment: "玩家小境界 0 - 9 阶",
  })
  public detailRealm: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    default: "0",
    comment: "玩家大境界 炼气、筑基、结丹、元婴、化神、练虚、合体、大乘、天仙、玄仙、太乙玉仙、大罗金仙、入道、明道、悟道、化道",
  })
  public realm: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    default: "1",
    comment: "玩家背包等级",
  })
  public packLevel: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    default: "0",
    comment: "玩家灵根等级",
  })
  public spiritRootLevel: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    default: "0",
    comment: "玩家通过地图关卡",
  })
  public checkpointLevle: number = 0
  
  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    default: "0",
    comment: "玩家功法id",
  })
  public exercisesMethodId: number = 0

  @MysqlField({
    type: "INT",
    size: 4,
    isUnsigned: true,
    default: "0",
    comment: "玩家招式id",
  })
  public movementArtsId: number = 0

  @MysqlField({
    type: "TIMESTAMP",
    default: "now()",
    comment: "玩家上一次修为增加的时间",
  })
  public lastUpExpTime: Date = new Date

  @MysqlField({
    type: "TIMESTAMP",
    default: "now()",
    comment: "玩家开始修行的时间",
  })
  public createTime: Date = new Date

}