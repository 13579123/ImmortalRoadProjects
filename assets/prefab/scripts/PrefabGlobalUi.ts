import { _decorator, Component, director, EditBox, Node } from 'cc';
import { ComponentExtension } from '../../scripts/extension/ComponentExtension';
import util from '../../cc_module/util';
import { request, ResultData } from '../../scripts/request';
import { native } from '../../cc_module/native';
const { ccclass, property } = _decorator;

@ccclass('PrefabGlobalUi')
export class PrefabGlobalUi extends ComponentExtension {

  @property(Node)
  protected SettingNode: Node

  @property(EditBox)
  protected RedeemCodeEditbox: EditBox

  openSetting() {
    this.RedeemCodeEditbox.string = ''
    this.SettingNode.active = true
  }

  closeSetting() {
    this.SettingNode.active = false
  }

  async useRedeemCode() {
    if(!this.RedeemCodeEditbox.string) return util.alert.message({message: '请输入兑换码'})
    const close = await util.alert.loading({message: '加载中。。。'})
    const result = await request.post<ResultData<any>>("/api/other/useRedeemCode" , {"code": this.RedeemCodeEditbox.string})
    close()
    if (!result) return
    if (!result.data.status) return await util.alert.message({message: result.data.message})
    util.alert.message({message: result.data.message})
  }

  async exitLogin() {
    const result = await util.alert.confirm({message: '确定要退出登录吗'})
    if (!result) return
    native.storage.del("immortal_road_token")
    director.loadScene("login")
  }

}


