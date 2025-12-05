import { _decorator, Component, Label, Node } from 'cc';
import { ComponentExtension } from '../../scripts/extension/ComponentExtension';
import { request, ResultData } from '../../scripts/request';
import util from '../../cc_module/util';
import { MethodExercises } from '../../scripts/database/MethodExercises';
import { GLOBAL_OPTION } from '../../scripts/GLOBAL_OPTION';
const { ccclass, property } = _decorator;

@ccclass('PrefabSeeSelf')
export class PrefabSeeSelf extends ComponentExtension {

  @property(Label)
  protected exercisesMethodLabel: Label

  @property(Label)
  protected realmLabel: Label

  @property(Label)
  protected bodyRealmLabel: Label

  @property(Label)
  protected powerLabel: Label

  @property(Label)
  protected attaclLabel: Label
  
  @property(Label)
  protected boneLabel: Label

  @property(Label)
  protected defenselLabel: Label

  @property(Label)
  protected physiqueLabel: Label

  @property(Label)
  protected maxhpLabel: Label

  @property(Label)
  protected movementLabel: Label

  @property(Label)
  protected speedLabel: Label

  @property(Label)
  protected wakanLabel: Label

  @property(Label)
  protected baojiLabel: Label

  @property(Label)
  protected spiritRootLabel: Label

  @property(Label)
  protected comprehensionLabel: Label

  @property(Label)
  protected execrisesSpeedLabel: Label

  protected async start() {
    this.effect(() => {
      const realm = GLOBAL_OPTION.playerProperty.realm , detailRealm = GLOBAL_OPTION.playerProperty.detailRealm
      this.realmLabel.string = '' + GLOBAL_OPTION.realmInfo.realm[realm] + (detailRealm + 1) + '阶'
      const bodyRealm = GLOBAL_OPTION.playerProperty.bodyRealm , bodyDetailRealm = GLOBAL_OPTION.playerProperty.bodyDetailRealm
      this.bodyRealmLabel.string = '' + GLOBAL_OPTION.realmInfo.bodyRealm[bodyRealm] + (bodyDetailRealm + 1) + '阶'
    })

    this.effect(() => {
      this.powerLabel.string = "真气: " + GLOBAL_OPTION.playerProperty.power
      this.attaclLabel.string = "攻击: " + GLOBAL_OPTION.playerProperty.power * 5
    })

    this.effect(() => {
      this.boneLabel.string = "根骨: " + GLOBAL_OPTION.playerProperty.bone
      this.defenselLabel.string = "防御: " + GLOBAL_OPTION.playerProperty.bone * 3
    })

    this.effect(() => {
      this.physiqueLabel.string = "体魄: " + GLOBAL_OPTION.playerProperty.physique
      this.maxhpLabel.string = "生命: " + GLOBAL_OPTION.playerProperty.physique * 20
    })

    this.effect(() => {
      this.movementLabel.string = "身法: " + GLOBAL_OPTION.playerProperty.movement
      this.speedLabel.string = "速度: " + GLOBAL_OPTION.playerProperty.movement * 2
    })

    this.effect(() => {
      this.wakanLabel.string = "灵力: " + GLOBAL_OPTION.playerProperty.wakan
      this.baojiLabel.string = "暴击: " + Math.min(
        Math.floor(
          (GLOBAL_OPTION.playerProperty.wakan / (GLOBAL_OPTION.playerProperty.wakan + 100)) * 100
        ),
        100
      ) + '%'
    })

    this.effect(() => {
      this.spiritRootLabel.string = 
        "灵根: "
        +
        GLOBAL_OPTION.realmInfo.spiritRootRealm[Math.floor(GLOBAL_OPTION.playerProperty.spiritRootLevel / 10)]
        +
        (GLOBAL_OPTION.playerProperty.spiritRootLevel + 1) % 10
        +
        "阶"
    })

    this.effect(() => {
      this.comprehensionLabel.string = '悟性: ' + GLOBAL_OPTION.playerProperty.comprehension
      this.execrisesSpeedLabel.string = '修炼速度: ' + Math.ceil(GLOBAL_OPTION.playerProperty.comprehension / 2 + 5)
    })

    const close = await util.alert.loading()
    const result = await request.get<ResultData<MethodExercises>>("/api/role/getExercises")
    this.exercisesMethodLabel.string = result.data.data.name + "(" + result.data.data.level + '阶' + ")"
    close()
  }

  protected closeNode() {
    if (this.node.parent) this.node.parent.removeChild(this.node)
    this.node.destroy()
  }

}


