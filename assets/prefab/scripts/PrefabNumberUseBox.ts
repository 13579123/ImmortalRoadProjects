import { _decorator, Button, Color, Component, EditBox, EventHandler, ImageAsset, Label, Node, Sprite, SpriteFrame, Texture2D } from 'cc';
import { ComponentExtension } from '../../scripts/extension/ComponentExtension';
import { RefData } from '../../cc_module/rx/core/ref/type';
import { rx } from '../../cc_module/rx';
import { Item } from '../../scripts/database/Item';
import { Pack } from '../../scripts/database/Pack';
import { native } from '../../cc_module/native';
const { ccclass, property } = _decorator;

type EquipmentProperty = {power?: number,bone?: number,physique?: number,movement?: number,wakan?: number}

@ccclass('PrefabNumberUseBox')
export class PrefabNumberUseBox extends ComponentExtension {

  @property(Sprite)
  protected itemSprite: Sprite

  @property(Label)
  protected titleLabel: Label

  @property(Label)
  protected introduceLabel: Label

  @property(EditBox)
  protected inputEditBox: EditBox

  @property(Node)
  protected FormNode: Node

  @property(Node)
  protected OperateNode: Node

  @property(Label)
  protected SellLabel: Label

  @property(Label)
  protected UseLabel: Label

  // 使用数量
  protected useCount: RefData<number> = rx.ref(1 , {forceUpdate: true})

  // 是否可以操作
  private canOperate: boolean = false

  // 物品
  protected item: Item = null

  // 背包对象
  protected pack: Pack = null

  public setItem(item: Item , pack: Pack , canOperate: boolean , options: {
    sellLabel?: string,
    useLabel?: string,
    forbidenSell?: boolean,
    forbidenUse?: boolean,
  } = {}) {
    this.item = item
    this.pack = pack
    this.canOperate = canOperate
    this.titleLabel.string = item.name
    this.introduceLabel.string = item.introduce
    if (this.item.isEquipment) {
      const extraData: EquipmentProperty = JSON.parse(this.item.extraDataJson || "{}")
      Object.keys(extraData).forEach((k: keyof EquipmentProperty) => {
        switch(k) {
          case "power":
            this.introduceLabel.string += '\n真气+ ' + extraData[k]
            break
          case "bone":
            this.introduceLabel.string += '\n根骨+ ' + extraData[k]
            break
          case "movement":
              this.introduceLabel.string += '\n身法+ ' + extraData[k]
              break
          case "physique":
            this.introduceLabel.string += '\n体魄+ ' + extraData[k]
            break
          case "wakan":
            this.introduceLabel.string += '\n灵力+ ' + extraData[k]
            break
        }
      })
    }
    if (options.sellLabel) this.SellLabel.string = options.sellLabel
    if (options.useLabel) this.UseLabel.string = options.useLabel
    if (item.canSell === 0 || options.forbidenSell) {
      this.SellLabel.node.parent.active = false
      // this.SellLabel.node.parent.getComponent(Sprite).color = new Color(190,190,190)
      // this.SellLabel.node.parent.getComponent(Button).transition = 0
    }
    if (item.canUse === 0 || options.forbidenUse) {
      this.UseLabel.node.parent.active = false
      // this.UseLabel.node.parent.getComponent(Sprite).color = new Color(190,190,190)
      // this.UseLabel.node.parent.getComponent(Button).transition = 0
    }
    const bundle = new native.AssetsManager()
    const promise = bundle.loadRemote<ImageAsset>(this.item.icon)
    promise.then((imageAsset) => {
      const spriteFrame = new SpriteFrame();
      const texture = new Texture2D();
      texture.image = imageAsset;
      spriteFrame.texture = texture
      this.itemSprite.spriteFrame = spriteFrame
    }).catch(e => console.log(e))
  }

  protected start(): void {
    if (this.item.isEquipment === 1) {
      this.FormNode.active = false
    }
    if (!this.canOperate) {
      this.OperateNode.active = false
    }
    this.effect(() => this.inputEditBox.string = this.useCount.value + '' )
    const editboxEventHandler = new EventHandler();
    editboxEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
    editboxEventHandler.component = 'PrefabNumberUseBox';
    editboxEventHandler.handler = 'onEditDidBegan';
    this.inputEditBox.editingDidEnded.push(editboxEventHandler)
  }

  protected onEditDidBegan(editbox: EditBox) {
    this.useCount.value = parseInt(editbox.string) || 0
  }

  // 使用数量 +1
  protected useCountAdd() {
    if (this.useCount.value + 1 >= this.pack?.itemCount) this.useCount.value = this.pack?.itemCount
    else this.useCount.value++
  }
  // 使用数量 -1
  protected useCountReduce() { 
    if (this.useCount.value - 1 <= 0) this.useCount.value = 0
    else this.useCount.value--
  }
  // 最大
  protected maxUse() { this.useCount.value = this.pack?.itemCount || 0 }
  protected minUse() { this.useCount.value = 0 }

  protected close() {
    this.node?.parent?.removeChild(this.node)
    this.node.destroy()
  }

  public onUseCallbacks: ((num: number , close: Function)=>any)[] = []
  public onSellCallbacks: ((num: number , close: Function)=>any)[] = []

  protected onUseItem() { 
    if (this.item.canUse === 0) return
    this.onUseCallbacks.forEach(c => c(this.useCount.value , () => this.close())) 
  }
  protected onSellItem() { 
    if (this.item.canSell === 0) return
    this.onSellCallbacks.forEach(c => c(this.useCount.value , () => this.close()))
  }
}


