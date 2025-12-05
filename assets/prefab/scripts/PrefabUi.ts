import { _decorator, Component, find, instantiate, Node, Prefab } from 'cc';
import { native } from '../../cc_module/native';
import util from '../../cc_module/util';
const { ccclass, property } = _decorator;

@ccclass('PrefabUi')
export class PrefabUi extends Component {

  // 开启背包
  protected async openBackpack() {
    const close = await util.alert.loading()
    const bundle = new native.AssetsManager("GloabelPrefab")
    const prefab = await bundle.load("Backpack" , Prefab)
    const node = instantiate(prefab)
    find("Canvas").addChild(node)
    close()
  }

  // 开启内视
  protected async openSeeSelf() {
    const close = await util.alert.loading()
    const bundle = new native.AssetsManager("GloabelPrefab")
    const prefab = await bundle.load("SeeSelf" , Prefab)
    const node = instantiate(prefab)
    find("Canvas").addChild(node)
    close()
  }

  // 开启功法
  protected async openMethod() {
    const close = await util.alert.loading()
    const bundle = new native.AssetsManager("GloabelPrefab")
    const prefab = await bundle.load("MethodExercises" , Prefab)
    const node = instantiate(prefab)
    find("Canvas").addChild(node)
    close()
  }

  // 开启灵根
  protected async openSpiritRoot() {
    const close = await util.alert.loading()
    const bundle = new native.AssetsManager("GloabelPrefab")
    const prefab = await bundle.load("SpiritRoot" , Prefab)
    const node = instantiate(prefab)
    find("Canvas").addChild(node)
    close()
  }

  // 开启招式
  protected async openMovementArts() {
    const close = await util.alert.loading()
    const bundle = new native.AssetsManager("GloabelPrefab")
    const prefab = await bundle.load("MovementArts" , Prefab)
    const node = instantiate(prefab)
    find("Canvas").addChild(node)
    close()
  }
  
}


