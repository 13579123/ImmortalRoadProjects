import { rx } from "../cc_module/rx";
import { Account } from "./database/Account";
import { Item } from "./database/Item";
import { Pack } from "./database/Pack";
import { Map } from "./database/Map";
import { UserProperty } from "./database/UserProperty";
import { Sect } from "./database/Sect";
import { UserSect } from "./database/UserSect";

interface GLOBAL_TYPE {
  httpServerHost: string,
  volume: number,
  nextRealmExp: number,
  playerAccount: Account,
  nextBodyRealmExp: number,
  playerProperty: UserProperty,
  currentMap: Map|null,
  playerSect: {sect: Sect , userSect: UserSect}|null,
  packItems: {item: Item , pack: Pack}[],
  realmInfo: { 
    realm: string[] , 
    bodyRealm: string[], 
    spiritRootRealm: string[], 
  },
  playerEquipment: { 
    weaponEquipment: {item: Item , pack: Pack} , 
    helmetEquipment: {item: Item , pack: Pack} , 
    clothesEquipment: {item: Item , pack: Pack} , 
    shoesEquipment: {item: Item , pack: Pack}, 
  },
}

// 全局配置
export const GLOBAL_OPTION = rx.reactive<GLOBAL_TYPE>({

  // 当前地图
  currentMap: null,

  httpServerHost: "http://127.0.0.1:4567",
  
  volume: 1, // 音量

  // 下一个境界需要的修为
  nextRealmExp: 0,

  // 下一个肉体需要的修为
  nextBodyRealmExp: 0,

  // 境界配置
  realmInfo: {realm: [] , bodyRealm: [] , spiritRootRealm: []},

  // 背包物品
  packItems: [],

  // 玩家账号信息
  playerAccount: null,

  // 玩家宗门信息
  playerSect: null,

  // 玩家装备
  playerEquipment: {
    weaponEquipment: null,
    helmetEquipment: null,
    clothesEquipment: null,
    shoesEquipment: null,
  },

  // 玩家属性
  playerProperty: null,

})