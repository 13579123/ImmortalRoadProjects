import { _decorator, Component, director, EditBox, Node, sp, Sprite, SpriteFrame } from 'cc';
import { ComponentExtension } from '../../../extension/ComponentExtension';
import { rx } from '../../../../cc_module/rx';
import { native } from '../../../../cc_module/native';
import { request } from '../../../request';
import util from '../../../../cc_module/util';
import { flashPlayerAccount } from '../../../tool/flashPlayerAccount';
import { flashPlaterProperty } from '../../../tool/flashPlayerProperty';
import { flashRealmInfo } from '../../../tool/flashRealmInfo';
const { ccclass, property } = _decorator;

@ccclass('ScenesRoleCnvasBegain')
export class ScenesRoleCnvasBegain extends ComponentExtension {

  @property(sp.Skeleton)
  protected previewSkeleton: sp.Skeleton

  @property(Sprite)
  protected manSelectBtnSprite: Sprite

  @property(Sprite)
  protected womanSelectBtnSprite: Sprite

  @property(EditBox)
  protected nicknameEditBox: EditBox

  public data = rx.reactive({
    sex: 1,
    role: null,
  })

  protected async start() {
    const bundle = new native.AssetsManager()
    const manPlayerSpine = await bundle.load("spine/man-player/skeleton", sp.SkeletonData)
    const womanPlayerSpine = await bundle.load("spine/woman-player/skeleton", sp.SkeletonData)
    const watch = rx.effect(() => {
      if (this.data.sex === 1) {
        this.previewSkeleton.skeletonData = manPlayerSpine
        this.previewSkeleton.setAnimation(1 , "rest" , true)
        bundle.load("texture/activity_img_btn_sel/spriteFrame", SpriteFrame).then(s => {
          this.manSelectBtnSprite.spriteFrame = s
        })
        bundle.load("texture/activity_img_btn_nor/spriteFrame", SpriteFrame).then(s => {
          this.womanSelectBtnSprite.spriteFrame = s
        })
      }
      else {
        this.previewSkeleton.skeletonData = womanPlayerSpine
        this.previewSkeleton.setAnimation(1 , "rest" , true)
        bundle.load("texture/activity_img_btn_sel/spriteFrame", SpriteFrame).then(s => {
          this.womanSelectBtnSprite.spriteFrame = s
        })
        bundle.load("texture/activity_img_btn_nor/spriteFrame", SpriteFrame).then(s => {
          this.manSelectBtnSprite.spriteFrame = s
        })
      }
    })
    this.effects.push(watch)
  }

  protected selectMan() { this.data.sex = 1 }

  protected selectWoman() { this.data.sex = 0 }

  protected async onStartGame() {
    const close = await util.alert.loading()
    const result = await request.post<any>("/api/role/generateRoleProperty" , {
      "roleId": this.data.role?.id || 1,
      "nickname": this.nicknameEditBox.string,
      "sex": this.data.sex
    })
    if (!result) return
    if (result.data.code !== 200) {
      return util.alert.confirm({
        title: "错误",
        message: result.data.message
      })
    }
    const promise = []
    promise.push(flashPlayerAccount())
    promise.push(flashRealmInfo())
    promise.push(flashPlaterProperty())
    await Promise.all(promise)
    close()
    director.loadScene("human")
  }

}


