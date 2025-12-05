import { Monster } from "../database/Monster";
import { MovementMatialArts } from "../database/MovementsMartialArts";
import { Pack } from "../database/Pack";
import { UserProperty } from "../database/UserProperty";
import { MysqlTransection } from "../module/mysql/MysqlTransection";
import { MoveMentArtsType } from "./MoveMentArtsType";

export interface FightState {
  hp: number,
  maxHp: number,
  attack: number,
  defense: number,
  speed: number,
  criticalHitRate: number,
  // property 原来的属性
  property: UserProperty|Monster
  // 使用招式
  movementArts: MovementMatialArts,
  movementArtsType: MoveMentArtsType,
}

export interface FightRoundState {
  round: number,
  // 行动方
  active: "player"|"monster",
  // 是否暴击
  isCriticalHit: boolean,
  // 是否闪避
  isMiss: boolean,
  // 造成伤害
  hurt: number,
  // 剩余状态
  player: FightState,
  monster: FightState,
}

export interface ItemTypeOption {
  transection?: MysqlTransection
}

export interface OnUseSellEquipmentState {
  success: boolean 
  message: string
}

export class ItemType {
  public code: string = ''

  async onUse(email: string , num: number , pack: Pack , option?: ItemTypeOption): Promise<OnUseSellEquipmentState> {return {success: true , message: '使用成功'}}
  async onEquipment (email: string, pack: Pack , option?: ItemTypeOption): Promise<OnUseSellEquipmentState> {return {success: true , message: '装备成功'}}
  async onSell (email: string , num: number, pack: Pack , option?: ItemTypeOption): Promise<OnUseSellEquipmentState> {return {success: true , message: '出售成功'}}
  async onUnEquipment (email: string, pack: Pack , option?: ItemTypeOption): Promise<OnUseSellEquipmentState> {return {success: true , message: '卸下成功'}}
  onAttack (selfState: FightState , otherState: FightState , hurt: number , option?: ItemTypeOption): any {}
  onHurt (selfState: FightState , otherState: FightState , hurt: number , option?: ItemTypeOption): any {}
}