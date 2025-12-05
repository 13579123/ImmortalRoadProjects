import { Request , Response , NextFunction } from "express"
import jsonwebtoken from 'jsonwebtoken'
import dotenv from "dotenv";
import { UserProperty } from "../database/UserProperty";
import { MethodExercises } from "../database/MethodExercises";

export const GLOBAL_SERVICE = {
  // 解析token为email
  parseUserToken: (function () {
    return (req: Request , resp: Response , next: NextFunction): string|null => {
      try {
        const email = jsonwebtoken.verify(req.headers.token as string , process.env.TOKEN_KEY || "") as string
        return email
      } catch (e) { return null }
    }
  })(),
  // 修为和肉体对属性的提升
  realmUpProperty: (function () {
    return (base: Partial<UserProperty> , realm: [number,number] , bodyRealm: [number,number]) => {
      const upPoperty = [2 , 5 , 10 , 20 , 40 , 70 , 100 , 150 , 200 , 250 , 350 , 450 , 600 , 800 , 1000 , 1500 , 2000]
      // 境界对四维的提升
      let realmUp = 0
      for (let i = 0; i <= realm[0]; i++) {
        const up = upPoperty[i]
        for (let j = 0; j <= (realm[0] === i ? realm[1] : 10); j++) realmUp += up
      }
      let bodyRealmUp = 0
      for (let i = 0; i <= bodyRealm[0]; i++) {
        const up = upPoperty[i]
        for (let j = 0; j <= (bodyRealm[0] === i ? bodyRealm[1] : 10); j++) bodyRealmUp += up
      }
      const realmUpProperty = {
        // 真气由肉体境界和练气境界一起决定
        power: Math.ceil(realmUp / 2 + bodyRealmUp / 2) ,  
        // 根骨由肉体境界决定
        bone: Math.ceil(realmUp / 2 + bodyRealmUp / 2),
        // 体魄由肉体境界决定
        physique: Math.ceil(realmUp / 2 + bodyRealmUp / 2),
        // 身法由练气境界决定
        movement: Math.ceil(realmUp / 2 + bodyRealmUp / 2),
        // 悟性由练气境界决定
        comprehension: Math.ceil(realmUp / 2),
      }
      return realmUpProperty
    }
  })(),
  // 获取最终属性
  getFinalProperty: (function () {
    return (base: UserProperty , equipments: {power?: number,bone?: number,physique?: number,movement?: number,wakan?: number}[] , exercisesMethod: MethodExercises): UserProperty => {
      const property = new UserProperty()
      // @ts-ignore
      Object.keys(base).forEach((k) => property[k] = base[k])
      const realmUp = GLOBAL_SERVICE.realmUpProperty(
        property , 
        [property.realm , property.detailRealm] , 
        [property.bodyRealm , property.bodyDetailRealm]
      )
      // 功法 灵根加成
      property.power += Math.ceil(exercisesMethod.power * base.spiritRootLevel * 0.2 * exercisesMethod.level + exercisesMethod.power) || 0
      property.bone += Math.ceil(exercisesMethod.bone * base.spiritRootLevel * 0.2 * exercisesMethod.level + exercisesMethod.bone) || 0
      property.physique += Math.ceil(exercisesMethod.physique * base.spiritRootLevel * 0.2 * exercisesMethod.level + exercisesMethod.physique) || 0
      property.movement += Math.ceil(exercisesMethod.movement * base.spiritRootLevel * 0.2 * exercisesMethod.level + exercisesMethod.movement) || 0
      property.comprehension += Math.ceil(exercisesMethod.comprehension * base.spiritRootLevel * 0.2 * exercisesMethod.level + exercisesMethod.comprehension) || 0
      property.wakan += Math.ceil(exercisesMethod.wakan + property.spiritRootLevel / 10 + exercisesMethod.level / 5) || 0
      // 境界加成
      property.power += realmUp.power || 0
      property.bone += realmUp.bone || 0
      property.physique += realmUp.physique || 0
      property.movement += realmUp.movement || 0
      property.comprehension += realmUp.comprehension || 0
      // 装备加成
      equipments.forEach((eq) => {
        property.power += eq?.power || 0
        property.bone += eq?.bone || 0
        property.physique += eq?.physique || 0
        property.movement += eq?.movement || 0
        property.wakan += eq?.wakan || 0
      })
      return property
    }
  })(),
  // 获取当前境界晋升需要的修为
  getNextRealmExp: (function () {
    // 需要修为缓存
    const cache = new Map<number , number>()
    return (realm: number , detailRealm: number) => {
      const realmNum = realm * 10 + detailRealm
      const cacheExp = cache.get(realmNum)
      if (cacheExp) return cacheExp
      let result = 100
      for(let i = 0 ; i < realmNum ; i++) {
        let next = 0.75
        for(let j = 1; j <= i ; j++) {
          if (next <= 0.1) break
          if (j % 5 === 0) next *= 0.8
        }
        result *= (1 + next)
      }
      cache.set(realmNum , Math.ceil(result))
      return Math.ceil(result)
    }
  })(),
}