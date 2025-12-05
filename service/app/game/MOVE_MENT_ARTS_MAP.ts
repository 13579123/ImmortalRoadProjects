import { MoveMentArtsType } from "./MoveMentArtsType";
import { TongTianZhi } from "./moveMentArts/TongTianZhi";
import { YiJianTianGang } from "./moveMentArts/YiJianTianGang";
import { ZhuTiHuaQi } from "./moveMentArts/ZhuTiHuaQi";

const MOVE_MENT_ARTS_MAP_CACHE = new Map<string , MoveMentArtsType>()

export const MOVE_MENT_ARTS_MAP = {
  set(key: string , value: MoveMentArtsType) {
    return MOVE_MENT_ARTS_MAP_CACHE.set(key , value)
  },
  get(key: string) {
    return MOVE_MENT_ARTS_MAP_CACHE.get(key) || new MoveMentArtsType()
  }
}

MOVE_MENT_ARTS_MAP.set("tong tian zhi" , new TongTianZhi)

MOVE_MENT_ARTS_MAP.set("yi jian tian gang" , new YiJianTianGang)

MOVE_MENT_ARTS_MAP.set("zhu ti hua qi" , new ZhuTiHuaQi)