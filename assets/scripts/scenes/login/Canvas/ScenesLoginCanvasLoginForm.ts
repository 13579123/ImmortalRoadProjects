import { _decorator, Color, Component, director, EditBox, find, Label, Node, Sprite } from 'cc';
import { request } from '../../../request';
import util from '../../../../cc_module/util';
import { rx } from '../../../../cc_module/rx';
import { ComponentExtension } from '../../../extension/ComponentExtension';
import { native } from '../../../../cc_module/native';
import { GLOBAL_OPTION } from '../../../GLOBAL_OPTION';
import { ScenesLoginCanvas } from '../ScenesLoginCanvas';
import { flashPlayerAccount } from '../../../tool/flashPlayerAccount';
import { flashRealmInfo } from '../../../tool/flashRealmInfo';
import { flashPlaterProperty } from '../../../tool/flashPlayerProperty';
const { ccclass, property } = _decorator;

@ccclass('ScenesLoginCanvasLoginForm')
export class ScenesLoginCanvasLoginForm extends ComponentExtension {
  
  @property(EditBox)
  protected emailEditBox: EditBox

  @property(EditBox)
  protected verifyEditBox: EditBox

  @property(Sprite)
  protected getVerifyBtnSprite: Sprite

  @property(Label)
  protected getVerifyBtnLabel: Label

  async onCloseClick() {
    this.node.active = false
  }

  // 验证码状态
  private getVerifyStatus = rx.ref("获取验证码")

  protected onLoad(): void {
    const watch = rx.effect(() => {
      this.getVerifyBtnLabel.string = this.getVerifyStatus.value + ''
      if (typeof this.getVerifyStatus.value === 'number') {
        this.getVerifyBtnSprite.color = new Color(100,100,100)
      } else {
        this.getVerifyBtnSprite.color = new Color(255,255,255)
      }
    })
  }

  // 获取验证码
  async onGetVerifyClick() {
    if (typeof this.getVerifyStatus.value !== 'string') return
    let timmer = 60

    this.getVerifyStatus.value = timmer + ""
    const inter = this.setAutoInterval(() => {
      this.getVerifyStatus.value = (--timmer) + ""
      if (timmer <= 0) timmerEnd()
    } , 1000)
    const timmerEnd = () => {
      inter()
      this.getVerifyStatus.value = "获取验证码"
    }
    const close = await util.alert.loading({message: "加载中..."})
    const result = await request.post<any>(
      "/api/other/getCode" , 
      {"email": this.emailEditBox.string}
    )
    close()
    if (!result) return timmerEnd()
    if (result.data.code !== 200) {
      timmerEnd()
      return util.alert.confirm({
        title: "错误",
        message: result.data.message
      })
    }
    util.alert.message({color: new Color(80 , 240 , 80) , message: result.data.message})
  }

  // 登录函数
  async onLoginClick() {
    const email = this.emailEditBox.string , code = this.verifyEditBox.string
    const close = await util.alert.loading({message: "加载中..."})
    let result = await request.post<any>("/api/account/login" , {email , code})
    close()
    if (!result) return
    if (result.data.code !== 200) {
      return util.alert.confirm({
        title: "错误",
        message: result.data.message
      })
    }
    native.storage.set("immortal_road_token" , result.data.data.token)
    // 查看是否已经存在角色
    result = await request.get<any>("/api/role/getRoleProperty")
    if (!result) return
    if (result.data.code !== 200) {
      return util.alert.confirm({
        title: "错误",
        message: result.data.message
      })
    }
    // 如果角色存在
    if (result.data.data) {
      let close = await util.alert.loading()
      const promise = []
      promise.push(flashPlayerAccount())
      promise.push(flashRealmInfo())
      promise.push(flashPlaterProperty())
      await Promise.all(promise)
      close()
      director.loadScene("human")
    }
    else director.loadScene("role")
  }

}


