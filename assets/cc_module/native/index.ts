import { AssetsManager } from "./assets/AssetsManager";
import { del, get, set } from "./storage";

export const native = {
  AssetsManager,
  storage: {
    get,
    set,
    del,
  }
}