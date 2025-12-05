import { _decorator, Button, Component, EventHandler, EventTouch, find, ImageAsset, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, Texture2D } from 'cc';
import { ComponentExtension } from '../../scripts/extension/ComponentExtension';
import { rx } from '../../cc_module/rx';
import util from '../../cc_module/util';
import { request, ResultData } from '../../scripts/request';
import { flashPackItems } from '../../scripts/tool/flashPackItems';
import { native } from '../../cc_module/native';
import { PrefabShowGainItem } from './PrefabShowGainItem';
import { Item } from '../../scripts/database/Item';
import { FolkPrescription } from '../../scripts/database/FolkPrescription';
const { ccclass, property } = _decorator;

interface PrefabFolkPrescriptionData {
  mainMaterialCount: number,
  mainMateiralItem: Item,
  otherMaterialCount: number,
  otherMateiralItem: Item,
  type: number,
  // 已经学习的丹方
  hasLearnFolkPrescription: FolkPrescription[]
}

const itemCache = new Map<number , Item>()

@ccclass('PrefabFolkPrescription')
export class PrefabFolkPrescription extends ComponentExtension {

  @property({ type: Node })
  protected SelectFolkPrescriptionNode: Node

  @property({ type: Sprite })
  protected BackgroundSprite: Sprite

  @property({ type: Node })
  protected SelectFolkPrescriptionContentNode: Node

  public reactiveData = rx.reactive<PrefabFolkPrescriptionData>({
    mainMaterialCount: 0,
    mainMateiralItem: null,
    otherMaterialCount: 0,
    otherMateiralItem: null,
    // 炼丹室还是炼器室
    type: 0,
    // 已经学习的丹方
    hasLearnFolkPrescription: []
  })

  protected async start() {
    // 根据类型设置背景图片
    this.effect(() => {
      const bundle = new native.AssetsManager("GloabelPrefab")
      if (this.reactiveData.type === 0) {
        bundle.load("/FolkPrescription/folkImage/spriteFrame" , SpriteFrame)
        .then(s => this.BackgroundSprite.spriteFrame = s)
      }
      if (this.reactiveData.type === 1) {
        bundle.load("/FolkPrescription/qidingImage/spriteFrame" , SpriteFrame)
        .then(s => this.BackgroundSprite.spriteFrame = s)
      }
    })
    // 根据物品id更新视图
    this.effect(() => {
      if (this.reactiveData.mainMateiralItem === null) {
        this.MainNode.getChildByName("Render").active = false
        return
      } else {
        this.MainNode.getChildByName("Render").active = true
      }
      this.renderMainItem(this.reactiveData.mainMateiralItem , this.reactiveData.mainMaterialCount)
    })
    this.effect(() => {
      if (this.reactiveData.otherMateiralItem === null) {
        this.OtherNode.getChildByName("Render").active = false
        return
      } else {
        this.OtherNode.getChildByName("Render").active = true
      }
      this.renderOtherItem(this.reactiveData.otherMateiralItem , this.reactiveData.otherMaterialCount)
    })
    // 获取所有已经学习的丹方
    const close = await util.alert.loading()
    const result = await request.get<ResultData<FolkPrescription[]>>("/api/folkPrescription/getHasLearnPrescription")
    close()
    if (!result) return
    if (!result.data.status) return util.alert.message({message: result.data.message})
    // 0 为丹方  
    this.reactiveData.hasLearnFolkPrescription = result.data.data.filter(folk => folk.type === this.reactiveData.type)
    // 丹方选择按钮渲染
    const FolkSelectItemNode = this.SelectFolkPrescriptionContentNode.children[0]
    this.SelectFolkPrescriptionContentNode.removeAllChildren()
    for (let i = 0; i < this.reactiveData.hasLearnFolkPrescription.length; i++) {
      const folk = this.reactiveData.hasLearnFolkPrescription[i]
      // 创建按钮
      const node = instantiate(FolkSelectItemNode)
      // 绑定事件
      const clickEventHandler = new EventHandler();
      clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
      clickEventHandler.component = 'PrefabFolkPrescription';// 这个是脚本类名
      clickEventHandler.handler = 'selectFolkPrescription';
      clickEventHandler.customEventData = JSON.stringify(folk);
      node.getComponent(Button).clickEvents.push(clickEventHandler)
      this.SelectFolkPrescriptionContentNode.addChild(node)

      if (itemCache.get(folk.exportItemId)) {
        node.getChildByName("Label").getComponent(Label).string = itemCache.get(folk.exportItemId).name
        if (this.reactiveData.type === 0) {
          node.getChildByName("Label").getComponent(Label).string += '丹方'
        }
        else if (this.reactiveData.type === 1) {
          node.getChildByName("Label").getComponent(Label).string += '制法'
        }
        continue
      }
      request.get<ResultData<Item[]>>(
        '/api/pack/getItemDetailById' , {params: {idList: folk.exportItemId}}
      ).then((result) => {
        if (!result) return
        if (!result.data.status) return util.alert.message({message: result.data.message})
        if (result.data.data.length <= 0) return util.alert.message({message: '物品不存在'})
        node.getChildByName("Label").getComponent(Label).string = result.data.data[0].name
        if (this.reactiveData.type === 0) {
          node.getChildByName("Label").getComponent(Label).string += '丹方'
        }
        else if (this.reactiveData.type === 1) {
          node.getChildByName("Label").getComponent(Label).string += '制法'
        }
        itemCache.set(result.data.data[0].id , result.data.data[0])
      })
    }
  }

  protected selectFolkPrescription(e: EventTouch , customer: string) {
    const folk: FolkPrescription = JSON.parse(customer)
    this.SelectFolkPrescriptionNode.active = false
    if (itemCache.get(folk.materialsMainItem)) {
      this.reactiveData.mainMateiralItem = itemCache.get(folk.materialsMainItem)
    } else {
      request.get<ResultData<Item[]>>(
        '/api/pack/getItemDetailById' , {params: {idList: folk.materialsMainItem}}
      ).then((result) => {
        if (!result) return
        if (!result.data.status) return util.alert.message({message: result.data.message})
        if (result.data.data.length <= 0) return util.alert.message({message: '物品不存在'})
        itemCache.set(result.data.data[0].id , result.data.data[0])
        this.reactiveData.mainMateiralItem = itemCache.get(folk.materialsMainItem)
      })
    }
    this.reactiveData.mainMaterialCount = folk.materialsMainItemNumber
    if (itemCache.get(folk.materialsOtherItem)) {
      this.reactiveData.otherMateiralItem = itemCache.get(folk.materialsOtherItem)
    } else {
      request.get<ResultData<Item[]>>(
        '/api/pack/getItemDetailById' , {params: {idList: folk.materialsOtherItem}}
      ).then((result) => {
        if (!result) return
        if (!result.data.status) return util.alert.message({message: result.data.message})
        if (result.data.data.length <= 0) return util.alert.message({message: '物品不存在'})
        itemCache.set(result.data.data[0].id , result.data.data[0])
        this.reactiveData.otherMateiralItem = itemCache.get(folk.materialsOtherItem)
      })
    }
    this.reactiveData.otherMaterialCount = folk.materialsOtherItemNumber
  }

  @property({ type: Node })
  protected MainNode: Node

  @property({ type: Node })
  protected OtherNode: Node

  // 渲染主材料到视图
  protected renderMainItem(item: Item , count: number) {
    const sprite = this.MainNode.getChildByName("Render").getChildByName("Sprite").getComponent(Sprite)
    const bundle = new native.AssetsManager()
    const promise = bundle.loadRemote<ImageAsset>(item.icon)
    promise.then((imageAsset) => {
      const spriteFrame = new SpriteFrame();
      const texture = new Texture2D();
      texture.image = imageAsset;
      spriteFrame.texture = texture
      sprite.spriteFrame = spriteFrame
    }).catch(e => console.log(e))
    this.MainNode.getChildByName("Render").getChildByName("Count").getComponent(Label).string = count + ''
  }

  // 渲染辅材料到视图
  protected renderOtherItem(item: Item , count: number) {
    const sprite = this.OtherNode.getChildByName("Render").getChildByName("Sprite").getComponent(Sprite)
    const bundle = new native.AssetsManager()
    const promise = bundle.loadRemote<ImageAsset>(item.icon)
    promise.then((imageAsset) => {
      const spriteFrame = new SpriteFrame();
      const texture = new Texture2D();
      texture.image = imageAsset;
      spriteFrame.texture = texture
      sprite.spriteFrame = spriteFrame
    }).catch(e => console.log(e))
    this.OtherNode.getChildByName("Render").getChildByName("Count").getComponent(Label).string = count + ''
  }

  // 选择丹方
  protected openSelectFolkPrescription() {
    this.SelectFolkPrescriptionNode.active = true
  }

  protected closeSelectFolkPrescription() {
    this.SelectFolkPrescriptionNode.active = false
  }

  // 炼制
  protected async refine() {
    if (!this.reactiveData.mainMateiralItem || !this.reactiveData.otherMateiralItem) 
      return await util.alert.confirm({message: '炼制材料不足'})
    const confirm = await util.alert.confirm({message: '炼制失败材料不会返回，确定要炼制吗?'})
    if (!confirm) return
    const close = await util.alert.loading()
    const result = await request.post<ResultData<{item: Item , count: number}>>("/api/folkPrescription/refiningDan" , {
      "firstItemId": this.reactiveData.mainMateiralItem.id,
      "firstItemCount": this.reactiveData.mainMaterialCount,
      "twoItemId": this.reactiveData.otherMateiralItem.id,
      "twoItemCount": this.reactiveData.otherMaterialCount
    })
    close()
    if (!result) return
    if (!result.data.status) return util.alert.message({message: result.data.message})
    this.reactiveData.mainMateiralItem = null
    this.reactiveData.otherMateiralItem = null
    this.reactiveData.mainMaterialCount = 0
    this.reactiveData.otherMaterialCount = 0
    await flashPackItems()
    // 展示获取的物品
    const bundle = new native.AssetsManager("GloabelPrefab")
		const ShowGainItemPrefab = await bundle.load("ShowGainItem", Prefab)
		const node = instantiate(ShowGainItemPrefab)
		const PrefabShowGainItemScript = node.getComponent(PrefabShowGainItem)
		find('Canvas').addChild(node)
		await PrefabShowGainItemScript.showGainItem([{ 
      itemId: result.data.data.item.id , 
      number: result.data.data.count ,
      item: result.data.data.item
    }])
  }

  protected close() {
    this.node?.parent?.removeChild(this.node)
    this.node.destroy()
  }

}


