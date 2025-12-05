import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { ComponentExtension } from '../../scripts/extension/ComponentExtension';
import { Item } from '../../scripts/database/Item';
import { native } from '../../cc_module/native';
import { PrefabPackItem } from './PrefabPackItem';
import { Pack } from '../../scripts/database/Pack';
const { ccclass, property } = _decorator;

interface dropItem {itemId: number , number: number , item: Item|null}

@ccclass('PrefabShowGainItem')
export class PrefabShowGainItem extends ComponentExtension {

  protected awaitPromise: Promise<any> = null

  protected awaitResolve: Function = null

  @property(Node)
  protected ItemContent: Node

  public async showGainItem(items: dropItem[]) {
    const bundle = new native.AssetsManager("GloabelPrefab")
		const PackItemPrefab = await bundle.load("PackItem", Prefab)
    // 渲染物品
    items.forEach(item => {
      const node = instantiate(PackItemPrefab)
      const prefabPackItemScript = node.getComponent(PrefabPackItem)
      prefabPackItemScript.setItem(item.item , {itemCount: item.number} as Pack , false)
      this.ItemContent.addChild(node)
    })
    if (this.awaitPromise) return this.awaitPromise
    this.awaitPromise = new Promise(res => {
      this.awaitResolve = res
    })
    return this.awaitPromise
  }


  protected async confirmClick() {
    this.awaitResolve()
    this.node.parent.removeChild(this.node)
    this.node.destroy()
  }

}


