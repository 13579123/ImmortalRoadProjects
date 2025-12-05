import { _decorator, Component, find, instantiate, Label, Node, Prefab, sp } from 'cc';
import util from '../../cc_module/util';
import { GLOBAL_OPTION } from '../../scripts/GLOBAL_OPTION';
import { ComponentExtension } from '../../scripts/extension/ComponentExtension';
import { request } from '../../scripts/request';
import calculateTime from '../../scripts/tool/calculateTime';
import { native } from '../../cc_module/native';
const { ccclass, property } = _decorator;

@ccclass('PrefabPlayerInfo')
export class ScenesHumanCanvasPlayerInfo extends ComponentExtension {

  @property(Label)
  protected nicknameLabel: Label

  @property(Label)
  protected realmLabel: Label

  @property(Label)
  protected timeLabel: Label

  @property(sp.Skeleton)
  protected avatarSkeleton: sp.Skeleton

  protected async onLoad() {
    // 动态设置玩家sketlen
    const bundle = new native.AssetsManager()
    const manPlayerSpine = await bundle.load("spine/man-player/skeleton", sp.SkeletonData)
    const womanPlayerSpine = await bundle.load("spine/woman-player/skeleton", sp.SkeletonData)

    this.effect(() => {
      if (GLOBAL_OPTION.playerAccount?.nickname)
        this.nicknameLabel.string = GLOBAL_OPTION.playerAccount.nickname
    })

    this.effect(() => {
      if (!GLOBAL_OPTION.playerProperty) return
      const realm = 
      GLOBAL_OPTION.realmInfo.realm[GLOBAL_OPTION.playerProperty.realm] 
      || 
      GLOBAL_OPTION.realmInfo.realm[GLOBAL_OPTION.realmInfo.realm.length - 1]
      const detailRealm = GLOBAL_OPTION.playerProperty.detailRealm || 0
      this.realmLabel.string = `${realm}${detailRealm + 1}阶`
    })

    this.effect(() => {
      if (!GLOBAL_OPTION.playerProperty) return
      if (GLOBAL_OPTION.playerProperty.sex === 0)
        this.avatarSkeleton.skeletonData = womanPlayerSpine
      else this.avatarSkeleton.skeletonData = manPlayerSpine
    })

    this.effect(() => {
      if (!GLOBAL_OPTION.playerProperty) return
      const year = calculateTime.getCultivateYear(
        Date.now() , 
        new Date(GLOBAL_OPTION.playerProperty.createTime || Date.now()).getTime()
      )
      this.timeLabel.string = '修炼 ' + year + '年'
    })

  }

}


