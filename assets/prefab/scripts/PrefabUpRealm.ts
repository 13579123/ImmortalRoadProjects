import { _decorator, Component, find, instantiate, Label, Node, Prefab, sp } from 'cc';
import util from '../../cc_module/util';
import { GLOBAL_OPTION } from '../../scripts/GLOBAL_OPTION';
import { ComponentExtension } from '../../scripts/extension/ComponentExtension';
import { request } from '../../scripts/request';
import { native } from '../../cc_module/native';
import { flashPlaterProperty } from '../../scripts/tool/flashPlayerProperty';
const { ccclass, property } = _decorator;

@ccclass('PrefabUpRealm')
export class PrefabUpRealm extends ComponentExtension {

  // 练气境界信息
  @property(Label)
  protected realmInfoLabel: Label

  // 肉体境界信息
  @property(Label)
  protected bodyRealmInfoLabel: Label

  protected start(): void {
    const bundle = new native.AssetsManager("GloabelPrefab")
    bundle.preload("SurviveCatastrophe" , Prefab)
    this.effect(() => {
      const realm = GLOBAL_OPTION.realmInfo.realm[GLOBAL_OPTION.playerProperty.realm] || "练气"
      this.realmInfoLabel.string = `境界 ${realm}${GLOBAL_OPTION.playerProperty.detailRealm + 1}阶\n${GLOBAL_OPTION.nextRealmExp}修为`
    })
    this.effect(() => {
      const bodyRealm = GLOBAL_OPTION.realmInfo.bodyRealm[GLOBAL_OPTION.playerProperty.bodyRealm] || "淬体"
      this.bodyRealmInfoLabel.string = `肉身 ${bodyRealm}${GLOBAL_OPTION.playerProperty.bodyDetailRealm + 1}阶\n${GLOBAL_OPTION.nextBodyRealmExp}修为`
    })
  }

  // 渡劫请求
  protected async onSurviveCatastropheClick() {
    const hasConfirm = await util.alert.confirm({
      title: "确认",
      message: `你的渡劫成功率有${GLOBAL_OPTION.playerProperty.hijackRate}%，失败会损失大量修为，确定要渡劫吗`
    })
    if (!hasConfirm) return
    if (GLOBAL_OPTION.playerProperty.exp < GLOBAL_OPTION.nextRealmExp)
      return util.alert.message({message: "修为不足"})

    const bundle = new native.AssetsManager("GloabelPrefab")
    const prefab = await bundle.load("SurviveCatastrophe" , Prefab)
    const node = instantiate(prefab)
    find("Canvas").addChild(node)
  }

  // 淬体请求
  protected async onQuenchingBodyClick() {
    const hasConfirm = await util.alert.confirm({
      title: "确认",
      message: `确定要消耗大量修为淬体吗？`
    })
    if (!hasConfirm) return
    let close = await util.alert.loading()
    const quencgingResult = await request.post<any>("/api/role/quenchingBody")
    const bundle = new native.AssetsManager()
    const skeletonData = await bundle.load("spine/body-up/zhugeliang_skill1_4" , sp.SkeletonData)
    if (!quencgingResult) return close()
    if (quencgingResult.data.code !== 200) {
      close()
      return util.alert.confirm({
        title: "错误",
        message: quencgingResult.data.message
      })
    }
    await flashPlaterProperty()
    close()

    // 淬体动画
    await new Promise(res => {
      const node = new Node
      node.setPosition(0 , -340)
      node.setScale(0.5 , 0.5)
      find("Canvas").addChild(node)
      const skeleton = node.addComponent(sp.Skeleton)
      skeleton.skeletonData = skeletonData
      skeleton.setAnimation(1 , "default" , false)
      skeleton.setCompleteListener(() => {
        node.parent?.removeChild(node)
        node.destroy()
        res(0)
      })
    })

    util.alert.message({message: quencgingResult.data.message})
  }

}

