import { UserProperty } from "../../database/UserProperty";
import { powerTurnToAttack } from "../../util/turn";
import { MoveMentArtsType } from "../MoveMentArtsType";

export class YiJianTianGang implements MoveMentArtsType{
  onAttack(finalProperty: UserProperty): number {
    return powerTurnToAttack(finalProperty.power) + finalProperty.power * 4
  }
}