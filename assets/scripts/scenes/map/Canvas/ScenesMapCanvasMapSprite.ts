import { __private, _decorator, Camera, Component, director, error, EventTouch, find, ImageAsset, instantiate, Node, NodeEventType, Prefab, Size, Sprite, SpriteFrame, Texture2D, UITransform, Vec3 } from 'cc';
import { ComponentExtension } from '../../../extension/ComponentExtension';
import { GLOBAL_OPTION } from '../../../GLOBAL_OPTION';
import util from '../../../../cc_module/util';
import { native } from '../../../../cc_module/native';
import { rx } from '../../../../cc_module/rx';
import { request, ResultData } from '../../../request';
import { Monster } from '../../../database/Monster';
import { PrefabFightMonsterConfirm } from '../../../../prefab/scripts/PrefabFightMonsterConfirm';
import { Item } from '../../../database/Item';
import { PrefabFightAnimation } from '../../../../prefab/scripts/PrefabFightAnimation';
import { MovementMatialArts } from '../../../database/MovementsMartialArts';
const { ccclass, property } = _decorator;


export interface FightState {
  hp: number,
  maxHp: number,
  attack: number,
  defense: number,
  speed: number,
  criticalHitRate: number,
  // 使用招式
  movementArts: MovementMatialArts | null
}

export interface FightRoundState {
  round: number,
  // 行动方
  active: "player"|"monster",
  // 是否暴击
  isCriticalHit: boolean,
  // 是否闪避
  isMiss: boolean,
  // 造成伤害
  hurt: number,
  // 剩余状态
  player: FightState,
  monster: FightState,
}

@ccclass('ScenesMapCanvasMapSprite')
export class ScenesMapCanvasMapSprite extends ComponentExtension {

  @property(Sprite)
  protected MapSprite: Sprite

  @property(Node)
  protected MonsterContainer: Node

  @property(Node)
  protected MapSpriteLayout: Node

  // 响应数据
  protected reactiveData = rx.reactive({
    currentX: 0,
    currentY: 0,
    moveAnimation: false,
    monsterList: []
  })

  protected async start() {
    // 判断是否有对应地图
    if (GLOBAL_OPTION.currentMap === null) return director.loadScene("human")
    this.reactiveData.currentX = GLOBAL_OPTION.currentMap.startX
    this.reactiveData.currentY = GLOBAL_OPTION.currentMap.startY
    // 加载数据
    const close = await util.alert.loading()
    const bundle = new native.AssetsManager()
    // 加载设置背景图片
    const spriteFrame = new SpriteFrame();
    const texture = new Texture2D();
    texture.image = await bundle.loadRemote<ImageAsset>(GLOBAL_OPTION.currentMap.mapImage);
    spriteFrame.texture = texture
    this.MapSprite.spriteFrame = spriteFrame
    this.node.setPosition(-this.reactiveData.currentX * 176 + 1672 , this.reactiveData.currentY * 176 - 1672)
    // 获取怪物数据
    const monsteResult = await request.get<ResultData<Monster[]>>(
      "/api/map/getMonsterByMap" , 
      {params: {mapId: GLOBAL_OPTION.currentMap.id}}
    )
    if (!monsteResult) return
    this.reactiveData.monsterList = monsteResult.data.data
    // 预先加载数据
    const awaitPromise = []
    this.reactiveData.monsterList.forEach(
      monster => awaitPromise.push(new Promise(res => bundle.loadRemote<ImageAsset>(monster.avatarImage).then(res)))
    )
    // 渲染地图块
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        const node = new Node
        const uiTransform = node.addComponent(UITransform)
        uiTransform.contentSize = new Size(176 , 176)
        node.on(NodeEventType.TOUCH_START , () => {
          if (this.reactiveData.moveAnimation) return
          if (this.reactiveData.currentX === j && this.reactiveData.currentY === i) return
          this.reactiveData.currentX = j
          this.reactiveData.currentY = i
        })
        this.MapSpriteLayout.addChild(node)
      }
    }
    // 渲染怪物
    this.effect(() => {
      this.MonsterContainer.removeAllChildren()
      for (let i = 0; i < this.reactiveData.monsterList.length; i++) {
        const monster = this.reactiveData.monsterList[i]
        const monsterSpriteNode = new Node
        monsterSpriteNode.setPosition(
          monster.conditionX * 176 -1678, 
          -monster.conditionY * 176 + 1692
        )
        const uiTransform = monsterSpriteNode.addComponent(UITransform)
        const sprite = monsterSpriteNode.addComponent(Sprite)
        sprite.sizeMode = 2
        const spriteFrame = new SpriteFrame();
        const texture = new Texture2D();
        bundle.loadRemote<ImageAsset>(monster.avatarImage).then(imageAsset => {
          texture.image = imageAsset;
          spriteFrame.texture = texture
          sprite.spriteFrame = spriteFrame
          this.MonsterContainer.addChild(monsterSpriteNode)
          const scale = 150 / uiTransform.contentSize.width
          monsterSpriteNode.setScale( scale , scale )
        })
      }
      return
    })
    // 响应处理位置
    this.effect(() => {
      this.reactiveData.moveAnimation = true
      const 
      targetX = -this.reactiveData.currentX * 176 + 1672 , 
      targetY = this.reactiveData.currentY * 176 - 1672
      this.moveTo(targetX , targetY , this.reactiveData.monsterList)
    })
    await Promise.all(awaitPromise)
    close()
  }

  // 移动动画
  private async moveTo(targetX: number , targetY: number , monsterList: Monster[]) {
    // 获取怪物确认框的预制体
    const bundle = new native.AssetsManager("GloabelPrefab")
    const FightMonsterConfirmPrefab = await bundle.load("FightMonsterConfirm", Prefab)
    // 移动速度
    const speed = 2
    let xMove = 0 , yMove = 0
    // 是否是合法坐标
    const hasToCondition = () => ((this.node.position.x - 1672) % 176 === 0) && ((this.node.position.y + 1672) % 176 === 0)
    // 是否有怪物
    const getConditionMonster = (x: number , y: number) => {
      for (let i = 0; i < monsterList.length; i++) {
        const monster = monsterList[i];
        if (monster.conditionX === x && monster.conditionY === y) return monster
      }
      return null
    }
    let lastX = Math.floor(-(this.node.position.x - 1672) / 176) , lastY = Math.floor((this.node.position.y + 1672) / 176)
    // 播放动画位移
    const clearInter = this.setAutoInterval(() => {
      if (this.node.position.x === targetX) {
        xMove = 0
        if (this.node.position.y === targetY) {
          yMove = 0
        }
        else if (targetY - this.node.position.y < 0) yMove = -speed
        else yMove = speed
      } else if (targetX - this.node.position.x < 0) xMove = -speed
      else xMove = speed
      // 到达目的地
      if (xMove === 0 && yMove === 0) {
        this.reactiveData.moveAnimation = false
        return clearInter()
      }
      this.node.setPosition( this.node.position.x + xMove , this.node.position.y + yMove )
      // 是否已经到了某个坐标
      if (hasToCondition()) {
        const templateX = -(this.node.position.x - 1672) / 176 , templateY = (this.node.position.y + 1672) / 176
        const monster = getConditionMonster(templateX , templateY)
        // 遇到怪物
        if (monster) {
          // 物品
          if (monster.physique === 0) {
            this.fightWithMonster(monster).then()
            // 在该位置停止
            this.reactiveData.currentX = templateX
            this.reactiveData.currentY = templateY
            this.reactiveData.moveAnimation = false
            return clearInter()
          }
          const node = instantiate(FightMonsterConfirmPrefab)
          const fightMonsterConfirm = node.getComponent(PrefabFightMonsterConfirm)
          fightMonsterConfirm.getUserSelect(monster).then((result) => {
            // 返回上一个格子
            if (!result) { this.reactiveData.currentX = lastX ; this.reactiveData.currentY = lastY }
            // 战斗
            else {
              this.fightWithMonster(monster).then(success => {
                // 战斗失败返回上一个格子
                if (!success) {this.reactiveData.currentX = lastX ; this.reactiveData.currentY = lastY}
              })
            }
            node.parent.removeChild(node)
            node.destroy()
          })
          find("Canvas").addChild(node)
          // 在该位置停止
          this.reactiveData.currentX = templateX
          this.reactiveData.currentY = templateY
          this.reactiveData.moveAnimation = false
          return clearInter()
        } 
        lastX = templateX
        lastY = templateY
      }
    } , 5)

  }

  protected async goNextMap() {
    const confirm = await util.alert.confirm({message: "您已经打败了这一关卡最强大的敌人，需要现在离开当前关卡吗"})
    if (!confirm) return 
    const close = await util.alert.loading()
    close()
    if (GLOBAL_OPTION.currentMap.mapWorld === 1) return director.loadScene("humanMap")
  }

  protected async fightWithMonster(monster: Monster) {
    const close = await util.alert.loading()
    // 战斗接口
    const result = await request.post<ResultData<{
      success: boolean,
      dropItems: {itemId: number , number: number , item: Item|null}[],
      fightStateReuslt: FightRoundState[],
    }>>("/api/map/fightWithMonster" , {"monsterId": monster.id})
    close()
    if (!result) return false
    if (!result.data.status) {
      util.alert.confirm({message: result.data.message})
      return false
    }
    // 创建战斗动画
    const bundle = new native.AssetsManager("GloabelPrefab")
    const FightAnimationPrefab = await bundle.load("FightAnimation", Prefab)
    const node = instantiate(FightAnimationPrefab)
    const script = node.getComponent(PrefabFightAnimation)
    find('Canvas').addChild(node)
    await script.playRoundState(
      result.data.data.success , 
      monster , 
      result.data.data.dropItems , 
      result.data.data.fightStateReuslt ,
      // 生命值为0说明是物品
      monster.physique === 0
    )
    node.parent.removeChild(node)
    node.destroy()
    // 战斗成功删除怪物
    if (result.data.data.success) {
      this.reactiveData.monsterList.splice(
        this.reactiveData.monsterList.indexOf(monster) ,
        1
      )
      // 如果是boss
      if (monster.isBoss) await this.goNextMap()
    }
    return result.data.data.success
  }

}


