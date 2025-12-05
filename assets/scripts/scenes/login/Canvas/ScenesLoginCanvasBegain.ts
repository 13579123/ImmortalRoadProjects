import { _decorator, Component, director, find, Node } from 'cc';
import { ComponentExtension } from '../../../extension/ComponentExtension';
import { native } from '../../../../cc_module/native';
import { request } from '../../../request';
import util from '../../../../cc_module/util';
import { ScenesLoginCanvas } from '../ScenesLoginCanvas';
import { flashPlayerAccount } from '../../../tool/flashPlayerAccount';
import { flashPlaterProperty } from '../../../tool/flashPlayerProperty';
import { flashRealmInfo } from '../../../tool/flashRealmInfo';
const { ccclass, property } = _decorator;

@ccclass('ScenesLoginCanvasBegain')
export class ScenesLoginCanvasBegain extends ComponentExtension {

  @property(Node)
  protected loginFormNode: Node

  async onBegainClick() {
    const token = native.storage.get("immortal_road_token")
    if (!token) return this.loginFormNode.active = true
    // 查看是否已经存在角色
    const close = await util.alert.loading()
    const result = await request.get<any>("/api/role/getRoleProperty")
    close()
    if (!result) return
    if (result.data.code !== 200) {
      return util.alert.confirm({
        title: "错误",
        message: result.data.message
      })
    }
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


