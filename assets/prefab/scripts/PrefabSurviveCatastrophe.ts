import { _decorator, AudioSource, Component, Node, sp } from 'cc';
import { ComponentExtension } from '../../scripts/extension/ComponentExtension';
import { request } from '../../scripts/request';
import util from '../../cc_module/util';
import { GLOBAL_OPTION } from '../../scripts/GLOBAL_OPTION';
import { native } from '../../cc_module/native';
import { flashPlaterProperty } from '../../scripts/tool/flashPlayerProperty';
const { ccclass, property } = _decorator;

@ccclass('PrefabSurviveCatastrophe')
export class PrefabSurviveCatastrophe extends ComponentExtension {

  @property(Node)
  protected completeNode: Node

  @property(Node)
  protected SuccessEffectNode: Node

  @property(sp.Skeleton)
  protected playerSkeleton: sp.Skeleton

  @property(sp.Skeleton)
  protected electronSkeleton: sp.Skeleton

  @property(AudioSource)
  protected electronAudio: AudioSource

  protected async start() {
    let close = await util.alert.loading()
    const result = await request.post<any>("/api/role/surviveCatastrophe")
    if (result.data.message !== '渡劫成功') {
      close()
      util.alert.message({message: result.data.message})
      return this.node.parent?.removeChild(this.node)
    }
    close()
    // 等动画完成
    await new Promise(res => { setTimeout(res , 1000) })
    await new Promise(res => { 
      let times = 2
      this.electronSkeleton.node.active = true
      this.electronSkeleton.setAnimation(1 , "animation" , false)
      this.electronSkeleton.setCompleteListener(() => {
        times--
        if (times <= 0) {
          this.electronSkeleton.node.active = false
          this.electronAudio.stop()
          return res(0)
        }
        this.electronSkeleton.setAnimation(1 , "animation" , false)
      })
    })
    this.completeNode.active = true
    close = await util.alert.loading()
    await flashPlaterProperty()
    close()
    util.alert.message({message: result.data.message})
    if (!result) return
    this.SuccessEffectNode.active = true
  }

  protected async onLoad() {
    const bundle = new native.AssetsManager()
    const manPlayerSpine = await bundle.load("spine/man-player/skeleton", sp.SkeletonData)
    const womanPlayerSpine = await bundle.load("spine/woman-player/skeleton", sp.SkeletonData)
    this.effect(() => {
      if (GLOBAL_OPTION.playerProperty.sex === 1)
        this.playerSkeleton.skeletonData = manPlayerSpine
      else this.playerSkeleton.skeletonData = womanPlayerSpine
      this.playerSkeleton.setAnimation(1 , "rest" , true)
    })
  }

  protected onComplete() {
    this.node.parent?.removeChild(this.node)
  }
}


