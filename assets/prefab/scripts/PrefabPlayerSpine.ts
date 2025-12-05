import { _decorator, Component, Node, sp } from 'cc';
import { ComponentExtension } from '../../scripts/extension/ComponentExtension';
import { GLOBAL_OPTION } from '../../scripts/GLOBAL_OPTION';
import { native } from '../../cc_module/native';
import { request } from '../../scripts/request';
import util from '../../cc_module/util';
const { ccclass, property } = _decorator;

@ccclass('PrefabPlayerSpine')
export class PrefabPlayerSpine extends ComponentExtension {
  
  @property(sp.Skeleton)
  protected playerSkeleton: sp.Skeleton
  
  async start() {
    const bundle = new native.AssetsManager()
    const manPlayerSpine = await bundle.load("spine/man-player/skeleton", sp.SkeletonData)
    const womanPlayerSpine = await bundle.load("spine/woman-player/skeleton", sp.SkeletonData)
    this.effect(() => {
      if (!GLOBAL_OPTION.playerProperty) return
      if (GLOBAL_OPTION.playerProperty.sex === 1)
        this.playerSkeleton.skeletonData = manPlayerSpine
      else this.playerSkeleton.skeletonData = womanPlayerSpine
      this.playerSkeleton.setAnimation(1 , "rest" , true)
    })

    request.get<any>("/api/role/getRoleProperty").then(result => {
      if (!result) return
      if (result.data.code !== 200) {
        return util.alert.confirm({
          title: "错误",
          message: result.data.message
        })
      }
      GLOBAL_OPTION.playerProperty = result.data.data
    })
    
  }
}


