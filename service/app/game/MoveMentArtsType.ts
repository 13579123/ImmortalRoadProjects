import { UserProperty } from "../database/UserProperty";
import { powerTurnToAttack } from "../util/turn";

export class MoveMentArtsType {
  // 攻击伤害计算
  onAttack (finalProperty: {power: number , bone: number , movement: number , physique: number}) {
    return powerTurnToAttack(finalProperty.power)
  }
}