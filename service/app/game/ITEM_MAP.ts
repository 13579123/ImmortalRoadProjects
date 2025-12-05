import { GongFaBaJiuXuanGong } from "./item/GongFaBaJiuXuanGong";
import { TianJieGengGuDang } from "./item/TianJieGengGuDang";
import { ItemType } from "./ItemType";

const ITEM_MAP_CACHE = new Map<string , ItemType>()

export const ITEM_MAP = {
  set(key: string , value: ItemType) {
    return ITEM_MAP_CACHE.set(key , value)
  },
  get(key: string) {
    return ITEM_MAP_CACHE.get(key) || new ItemType()
  }
}

ITEM_MAP.set(new TianJieGengGuDang().code , new TianJieGengGuDang)

ITEM_MAP.set(new GongFaBaJiuXuanGong().code , new GongFaBaJiuXuanGong)