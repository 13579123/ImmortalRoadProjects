import { _decorator, Component, EventTouch, find, ImageAsset, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, Texture2D } from 'cc';
import { ComponentExtension } from '../../scripts/extension/ComponentExtension';
import { native } from '../../cc_module/native';
import util from '../../cc_module/util';
import { GLOBAL_OPTION } from '../../scripts/GLOBAL_OPTION';
import { request } from '../../scripts/request';
import { PrefabPackItem } from './PrefabPackItem';
import { flashPlayerEquipment } from '../../scripts/tool/flashPlayerEquipment';
import { flashPackItems } from '../../scripts/tool/flashPackItems';
import { PrefabNumberUseBox } from './PrefabNumberUseBox';
import { Item } from '../../scripts/database/Item';
import { Pack } from '../../scripts/database/Pack';
const { ccclass, property } = _decorator;

@ccclass('PrefabBackpack')
export class PrefabBackpack extends ComponentExtension {

  @property(Sprite)
  protected weaponEquipmentSprite: Sprite

  @property(Sprite)
  protected helmetEquipmentSprite: Sprite

  @property(Sprite)
  protected clothesEquipmentSprite: Sprite

  @property(Sprite)
  protected shoesEquipmentSprite: Sprite

  @property(Label)
  protected titleLabel: Label

  @property(Label)
  protected contentLabel: Label

  @property(Node)
  protected packContentNode: Node

  protected start() {
    this.equipmentStart().then().catch(e => console.log(e))
    this.backpackStart().then().catch(e => console.log(e))
  }

  // 打开装备详情
  protected async showDetailEquipment(event: EventTouch , type: string) {
    let equipment: {item: Item , pack: Pack}
    switch(type) {
      case "helmet": 
        equipment = GLOBAL_OPTION.playerEquipment.helmetEquipment
      break;
      case "weapon": 
        equipment = GLOBAL_OPTION.playerEquipment.weaponEquipment
      break;
      case "clothes": 
        equipment = GLOBAL_OPTION.playerEquipment.clothesEquipment
      break;
      case "shoes": 
        equipment = GLOBAL_OPTION.playerEquipment.shoesEquipment
      break;
    }
    if (!equipment) return
    const close = await util.alert.loading()
    const bundle = new native.AssetsManager("GloabelPrefab")
    const PackItemPrefab = await bundle.load("NumberUseBox", Prefab)
    close()
    const node = instantiate(PackItemPrefab)
    find("Canvas").addChild(node)
    const numberUseBoxScript = node.getComponent(PrefabNumberUseBox)
    numberUseBoxScript.setItem(
      equipment.item , 
      equipment.pack , 
      true , 
      { useLabel: "卸下" , forbidenSell: true}
    )
    // 卸下装备
    numberUseBoxScript.onUseCallbacks.push(async (num , close) => {
      const closeLoading = await util.alert.loading()
      const result = await request.post<any>("/api/pack/unEquipment" , {
        packId: equipment.pack.id,
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
    })
  }

  // 装备相关的初始化
  protected async equipmentStart() {
    // 获取装备信息
    const close = await util.alert.loading()
    await flashPlayerEquipment()
    close()
    // 响应式渲染
    let lastWeaponPromise: Promise<any> = null
    this.effect(() => {
      this.weaponEquipmentSprite.spriteFrame = null
      if (!GLOBAL_OPTION.playerEquipment.weaponEquipment) return
      util.alert.loading().then(async close => {
        const bundle = new native.AssetsManager()
        const promise = lastWeaponPromise = bundle.loadRemote<ImageAsset>(GLOBAL_OPTION.playerEquipment.weaponEquipment.item.icon)
        lastWeaponPromise.then(imageAsset => {
          close()
          if (promise !== lastWeaponPromise) return
          const spriteFrame = new SpriteFrame();
          const texture = new Texture2D();
          texture.image = imageAsset;
          spriteFrame.texture = texture
          this.weaponEquipmentSprite.spriteFrame = spriteFrame
        }).catch(e => e)
      })
      return
    })

    let lastHelmetPromise: Promise<any> = null
    this.effect(() => {
      this.helmetEquipmentSprite.spriteFrame = null
      if (!GLOBAL_OPTION.playerEquipment.helmetEquipment) return
      util.alert.loading().then(async close => {
        const bundle = new native.AssetsManager()
        const promise = lastHelmetPromise = bundle.loadRemote<ImageAsset>(GLOBAL_OPTION.playerEquipment.helmetEquipment.item.icon)
        const imageAsset = await lastHelmetPromise
        close()
        if (promise !== lastHelmetPromise) return
        const spriteFrame = new SpriteFrame();
        const texture = new Texture2D();
        texture.image = imageAsset;
        spriteFrame.texture = texture
        this.helmetEquipmentSprite.spriteFrame = spriteFrame
      })
      return
    })

    let lastClothesPromise: Promise<any> = null
    this.effect(() => {
      this.clothesEquipmentSprite.spriteFrame = null
      if (!GLOBAL_OPTION.playerEquipment.clothesEquipment) return
      util.alert.loading().then(async close => {
        const bundle = new native.AssetsManager()
        const promise = lastClothesPromise = bundle.loadRemote<ImageAsset>(GLOBAL_OPTION.playerEquipment.clothesEquipment.item.icon)
        const imageAsset = await lastClothesPromise
        close()
        if (promise !== lastClothesPromise) return
        const spriteFrame = new SpriteFrame();
        const texture = new Texture2D();
        texture.image = imageAsset;
        spriteFrame.texture = texture
        this.clothesEquipmentSprite.spriteFrame = spriteFrame
      })
      return
    })

    let lastShoesPromise: Promise<any> = null
    this.effect(() => {
      this.shoesEquipmentSprite.spriteFrame = null
      if (!GLOBAL_OPTION.playerEquipment.shoesEquipment) return
      util.alert.loading().then(async close => {
        const bundle = new native.AssetsManager()
        const promise = lastShoesPromise = bundle.loadRemote<ImageAsset>(GLOBAL_OPTION.playerEquipment.shoesEquipment.item.icon)
        const imageAsset = await lastShoesPromise
        close()
        if (promise !== lastShoesPromise) return
        const spriteFrame = new SpriteFrame();
        const texture = new Texture2D();
        texture.image = imageAsset;
        spriteFrame.texture = texture
        this.shoesEquipmentSprite.spriteFrame = spriteFrame
      })
      return
    })
  }

  // 背包相关的初始化
  protected async backpackStart() {
    const bundle = new native.AssetsManager("GloabelPrefab")
    const PackItemPrefab = await bundle.load("PackItem", Prefab)
    this.effect(() => {
      let level = '壹'
      if (GLOBAL_OPTION.playerProperty.packLevel >= 9) level = '玖'
      else if (GLOBAL_OPTION.playerProperty.packLevel >= 8) level = '捌'
      else if (GLOBAL_OPTION.playerProperty.packLevel >= 7) level = '柒'
      else if (GLOBAL_OPTION.playerProperty.packLevel >= 6) level = '陆'
      else if (GLOBAL_OPTION.playerProperty.packLevel >= 5) level = '伍'
      else if (GLOBAL_OPTION.playerProperty.packLevel >= 4) level = '肆'
      else if (GLOBAL_OPTION.playerProperty.packLevel >= 3) level = '叁'
      else if (GLOBAL_OPTION.playerProperty.packLevel >= 2) level = '贰'
      this.titleLabel.string = level + '阶储物袋'
    })
    const close = await util.alert.loading()
    await flashPackItems()
    close()
    this.effect(() => {
      const max = (GLOBAL_OPTION.playerProperty.packLevel - 1) * 12 + 36
      this.packContentNode.removeAllChildren()
      for (let i = 0; i < max; i++) {
        const node = instantiate(PackItemPrefab)
        this.packContentNode.addChild(node)
        const packItemScript = node.getComponent(PrefabPackItem)
        if (GLOBAL_OPTION.packItems[i]) 
          packItemScript.setItem(GLOBAL_OPTION.packItems[i].item , GLOBAL_OPTION.packItems[i].pack , true)
      }
      this.contentLabel.string = GLOBAL_OPTION.packItems.length + '/' + ((GLOBAL_OPTION.playerProperty.packLevel - 1) * 12 + 36)
    })
  }

  protected closeBackpack() {
    this.node?.parent?.removeChild(this.node)
    this.node.destroy()
  }

}


