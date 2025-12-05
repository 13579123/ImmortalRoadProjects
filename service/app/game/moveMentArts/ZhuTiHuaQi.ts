import { UserProperty } from "../../database/UserProperty";
import { powerTurnToAttack } from "../../util/turn";
import { MoveMentArtsType } from "../MoveMentArtsType";

export class ZhuTiHuaQi implements MoveMentArtsType{
  onAttack(finalProperty: UserProperty): number {
    return powerTurnToAttack(finalProperty.power) + finalProperty.bone * 4
  }
}