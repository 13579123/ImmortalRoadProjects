import { _decorator, Component, error, find, ImageAsset, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, Texture2D } from 'cc';
import { ComponentExtension } from '../../scripts/extension/ComponentExtension';
import { native } from '../../cc_module/native';
import { Item } from '../../scripts/database/Item';
import { Pack } from '../../scripts/database/Pack';
import util from '../../cc_module/util';
import { PrefabNumberUseBox } from './PrefabNumberUseBox';
import { request } from '../../scripts/request';
import { flashPlayerEquipment } from '../../scripts/tool/flashPlayerEquipment';
import { flashPackItems } from '../../scripts/tool/flashPackItems';
import { flashPlaterProperty } from '../../scripts/tool/flashPlayerProperty';
const { ccclass, property } = _decorator;

@ccclass('PrefabPackItem')
export class PrefabPackItem extends ComponentExtension {

  @property(Sprite)
  private itemSprite: Sprite = null

  @property(Label)
  private itemCountLabel: Label = null

  // 物品对象
  private item: Item = null

  // 背包对象
  private pack: Pack = null

  // 是否可以操作
  private canOperate: boolean = false

  public setItem(item: Item , pack: Pack , canOperate: boolean = false) {
    this.item = item
    this.pack = pack
    this.canOperate = canOperate
    this.effectItem()
  }

  private lastPromise: Promise<ImageAsset> = null

  private effectItem() {
    if (!this.item || !this.pack) return
    if (this.pack.itemCount) this.itemCountLabel.string = '' + this.pack.itemCount
    else this.itemCountLabel.string = ''
    const bundle = new native.AssetsManager()
    const promise = this.lastPromise = bundle.loadRemote<ImageAsset>(this.item.icon)
    promise.then((imageAsset) => {
      if (promise !== this.lastPromise) return
      const spriteFrame = new SpriteFrame();
      const texture = new Texture2D();
      texture.image = imageAsset;
      spriteFrame.texture = texture
      this.itemSprite.spriteFrame = spriteFrame
    }).catch(e => console.log(e))
  }

  protected async onClickCallback() {
    if (!this.canOperate || !this.item) return
    const close = await util.alert.loading()
    const bundle = new native.AssetsManager("GloabelPrefab")
    const PackItemPrefab = await bundle.load("NumberUseBox", Prefab)
    close()
    const node = instantiate(PackItemPrefab)
    find("Canvas").addChild(node)
    const numberUseBoxScript = node.getComponent(PrefabNumberUseBox)
    numberUseBoxScript.setItem(this.item , this.pack , this.canOperate , { useLabel: this.item.isEquipment ? "装备" : "使用" })
    numberUseBoxScript.onUseCallbacks.push(this.onUseCallback.bind(this))
    numberUseBoxScript.onSellCallbacks.push(this.onSellCallback.bind(this))
  }

  protected async onUseCallback(num: number , close: Function) {
    const closeLoading = await util.alert.loading()
    const result = await request.post<any>("/api/pack/usePackItem" , {
      packId: this.pack.id,
      useCount: num
    })
    if (!result) return
    if (result.data.code !== 200) {
      return util.alert.confirm({
        title: "错误",
        message: result.data.message
      })
    }
    util.alert.message({message: result.data.message})
    await flashPlayerEquipment()
    await flashPackItems()
    closeLoading()
    close()
  }

  protected async onSellCallback(num: number , close: Function) {
    let closeLoading = null
    try {
      const ready = await util.alert.confirm({
        message: "确定要卖出" + num + "个" + this.item.name + "吗,卖出后可以获得" + this.item.price * num + "个灵石"
      })
      if (!ready) return
      closeLoading = await util.alert.loading()
      const result = await request.post<any>("/api/pack/sellPackItem" , {
        packId: this.pack.id,
        sellCount: num
      })
      if (!result) return
      if (result.data.code !== 200) {
        return util.alert.confirm({
          title: "错误",
          message: result.data.message
        })
      }
      util.alert.message({message: result.data.message})
      await flashPlayerEquipment()
      await flashPackItems()
      close()
    } catch (e) { error(e) } finally {
      if (closeLoading) closeLoading()
    }
  }
  
}


