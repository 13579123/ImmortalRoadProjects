import { NextFunction, Request, Response } from "express";
import { service } from "../service/service";
import { redis } from "../../../connection/redis";
import { getFail, getSuccess } from "../../../util/result";
import { sendMailer } from "../../../connection/mailer";
import { Map } from "../../../database/Map";
import { Monster } from "../../../database/Monster";
import CODE_RULE from "../../../module/CODE_RULE";
import { GLOBAL_SERVICE } from "../../GLOBAL_SERVICE";
import { MysqlTableClass } from "../../../module/mysql/MysqlTableClass";
import { UserProperty } from "../../../database/UserProperty";
import {service as RoleService} from './../../role/service/service'
import { FightRoundState, FightState } from "../../../game/ItemType";
import { ITEM_MAP } from "../../../game/ITEM_MAP";
import { Item } from "../../../database/Item";
import { Pack } from "../../../database/Pack";
import { service as PackService} from './../../pack/service/service'
import { boneTurnToDefense, movementTurnToSpeed, physiqueTurnToHp, powerTurnToAttack } from "../../../util/turn";
import { MoveMentArtsType } from "../../../game/MoveMentArtsType";
import { MovementMatialArts } from "../../../database/MovementsMartialArts";
import { MOVE_MENT_ARTS_MAP } from "../../../game/MOVE_MENT_ARTS_MAP";

export function fightWithMonster() {
  return async (req: Request , resp: Response , next: NextFunction) => {
    let email = GLOBAL_SERVICE.parseUserToken(req , resp , next)
    if (email === null) return resp.send(getFail(CODE_RULE.UNLOGIN , "用户登录信息失效"))
    const transection = MysqlTableClass.getTransection()
    try {
      // 战斗结果存储
      const fightStateReuslt: FightRoundState[] = []
      // 获取玩家数据
      const userProperty = await UserProperty.queryOne<UserProperty>({
        conditions: [ {key: "email" , value: email} ] ,
        lockType: 'X LOCK',
        transection
      }) as UserProperty
      if (!userProperty) return resp.send(getFail(CODE_RULE.SUCCESS , "属性信息不存在" , null))
      // 玩家招式
      const movementArts = await MovementMatialArts.queryOne<MovementMatialArts>({
        conditions: [{key: 'id' , value: userProperty.movementArtsId}],
        transection
      })
      let movementArtsType: MoveMentArtsType
      if (!movementArts) movementArtsType = new MoveMentArtsType()
      else movementArtsType = MOVE_MENT_ARTS_MAP.get(movementArts.code as string) || new MoveMentArtsType()
      // 玩家最终属性 ， 装备信息 ， 所使用的功法
      const {
        finalProperty,
        equipmentItems,
        exercisesMethod
      } = await RoleService.getUserFinalProperty(email , userProperty as UserProperty , transection)
      // 怪物属性
      const monster: Monster = await Monster.queryOne<Monster>({
        conditions: [{key: 'id' , value: req.body.monsterId}],
        transection 
      }) as Monster
      if (!monster) return resp.send(getFail(CODE_RULE.ARGUMENT_ERROR , '怪物信息不存在'))
      // 状态创建
      const playerState: FightState = {
        hp: physiqueTurnToHp(finalProperty.physique),
        maxHp: physiqueTurnToHp(finalProperty.physique),
        attack: powerTurnToAttack(finalProperty.power),
        defense: boneTurnToDefense(finalProperty.bone),
        speed: movementTurnToSpeed(finalProperty.movement),
        property: finalProperty,
        criticalHitRate: finalProperty.wakan / (finalProperty.wakan + 100),
        movementArts: (movementArts as MovementMatialArts) || new MovementMatialArts,
        movementArtsType,
      }
      const monsterState: FightState = {
        hp: physiqueTurnToHp(monster.physique),
        maxHp: physiqueTurnToHp(monster.physique),
        attack: powerTurnToAttack(monster.power),
        defense: boneTurnToDefense(monster.bone),
        speed: movementTurnToSpeed(monster.movement),
        criticalHitRate: 0.1,
        property: monster,
        movementArts: { name: '天妖变' } as any,
        movementArtsType: new MoveMentArtsType,
      }
      // 开始回合
      let currentActive: 'player'|'monster' = monsterState.speed > playerState.speed ? 'monster' : 'player'
      // 战斗结果
      let success = false
      for (let i = 0 ; i < 20 ; i++) {
        let activeState: FightState , otherState: FightState
        const fightRoundState: FightRoundState = {
          round: i + 1,
          active: currentActive,
          isCriticalHit: false,
          isMiss: false,
          hurt: 0,
          player: playerState,
          monster: monsterState,
        }
        // 获取当前行动方
        if (currentActive === 'player') {
          activeState = playerState
          otherState = monsterState
          currentActive = 'monster'
        } else {
          activeState = monsterState
          otherState = playerState
          currentActive = 'player'
        }
        // 闪避概率
        const missRate = Math.min((otherState.speed - activeState.speed) / otherState.speed , 0.45)
        // 闪避了
        if (Math.random() < missRate) {
          fightRoundState.player = {...playerState}
          fightRoundState.monster = {...monsterState}
          fightRoundState.isMiss = true
          fightStateReuslt.push(fightRoundState)
          continue
        }
        // 伤害
        let hurt = Math.ceil(
          Math.max( activeState.movementArtsType.onAttack(activeState.property) - otherState.defense , 1 ) * (Math.random() * 0.2 + 0.9)
        )
        // 暴击
        if (Math.random() < activeState.criticalHitRate) {
          fightRoundState.isCriticalHit = true
          fightRoundState.hurt = hurt = Math.ceil(hurt * 1.5)
        }
        otherState.hp = Math.max(otherState.hp - hurt , 0)
        // 装备生效
        equipmentItems.forEach(equipment => {
          const itemType = ITEM_MAP.get(equipment.code as string)
          if (activeState === playerState) {
            itemType?.onAttack(playerState , monsterState , hurt)
          } else {
            itemType?.onHurt(playerState , monsterState , hurt)
          }
        })
        // 设置状态
        fightRoundState.hurt = hurt
        fightRoundState.player = {...playerState}
        fightRoundState.monster = {...monsterState}
        fightStateReuslt.push(fightRoundState)
        // 如果有人hp为0
        if (monsterState.hp === 0) {
          success = true
          break
        }
        if (playerState.hp === 0) break
      }
      // 如果胜利需要结算奖励
      const drops: {rate: number , itemId: number , minNumber: number , maxNumber: number}[] = JSON.parse(monster.dropJson)
      const dropItems: {itemId: number , number: number , item: Item|null}[] = []
      if (success) {
        drops.forEach(drop => {
          if (Math.random() > drop.rate) return
          dropItems.push({
            itemId: drop.itemId , 
            number: Math.ceil(Math.random() * (drop.maxNumber - drop.minNumber) + drop.minNumber) , 
            item: null
          })
        })
        for (let i = 0; i < dropItems.length; i++) {
          const drop = dropItems[i]
          const result = await PackService.addItemToPack(email , userProperty.packLevel || 1 , drop.itemId , drop.number , transection)
          drop.item = result.item
        }
        // 如果是boss则判断是否开启下一关
        if (monster.isBoss === 1) {
          const map = await Map.queryOne<Map>({conditions: [{key: 'id' , value: monster.mapId}] , transection}) as Map
          if (Math.ceil(userProperty.checkpointLevle / 15) <= map.mapWorld && userProperty.checkpointLevle % 15 <= map.mapLevel) {
            userProperty.checkpointLevle = userProperty.checkpointLevle + 1
            await UserProperty.update<UserProperty>(userProperty , [{key: 'email' , value: userProperty.email}] , {transection})
          }
        }
      }
      // 返回数据
      resp.send(getSuccess(CODE_RULE.SUCCESS , '战斗结束' , { success, dropItems, fightStateReuslt, }))
    } catch(e) {
      await transection.rollback()
      next(e)
    } finally {
      transection.commit()
    }
  }
}