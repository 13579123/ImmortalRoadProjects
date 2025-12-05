import { _decorator, Component, Label, nextPow2, Node, RichText } from 'cc';
import { ComponentExtension } from '../../scripts/extension/ComponentExtension';
import { GLOBAL_OPTION } from '../../scripts/GLOBAL_OPTION';
import util from '../../cc_module/util';
import { request, ResultData } from '../../scripts/request';
import { flashPlaterProperty } from '../../scripts/tool/flashPlayerProperty';
const { ccclass, property } = _decorator;

@ccclass('PrefabSpiritRoot')
export class PrefabSpiritRoot extends ComponentExtension {

  @property(Label)
  protected spiritRootLabel: Label

  @property(RichText)
  protected needExpRichText: RichText

  private nextNeedExp: number = 0

  protected async start() {
    this.effect(() => {
      this.spiritRootLabel.string = 
        GLOBAL_OPTION.realmInfo.spiritRootRealm[Math.floor(GLOBAL_OPTION.playerProperty.spiritRootLevel / 10)]
        +
        '灵根'
        +
        (GLOBAL_OPTION.playerProperty.spiritRootLevel % 10 + 1)
        +
        "阶"
    })
    await this.flashNeedExp()
  }

  protected async flashNeedExp() {
    let close = await util.alert.loading()
    let result = await request.get<ResultData<any>>("/api/other/getNextRealmExp" , {
      params: { realm: 0 , detailRealm: GLOBAL_OPTION.playerProperty.spiritRootLevel}
    })
    close()
    if (!result) return
    if (!result.data.status) {
      return util.alert.confirm({
        title: "错误",
        message: result.data.message
      })
    }
    this.nextNeedExp = result.data.data.exp
    this.needExpRichText.string = `<color=#ffffff>下一阶段需要</color><color=#00ff00>${this.nextNeedExp}</color><color=#ffffff>修为</color>`
  }

  protected async spiritRootLevelUp() {
    let confrim = await util.alert.confirm({ message: `蕴养灵根需要消耗${this.nextNeedExp}修为，确定要蕴养灵根吗` })
    if (!confrim) return
    const close = await util.alert.loading()
    const result = await request.post<any>("/api/role/spiritRootUp")
    await flashPlaterProperty()
    close()
    if (!result) return
    if (result.data.code !== 200) {
      return util.alert.confirm({
        title: "错误",
        message: result.data.message
      })
    }
    await this.flashNeedExp()
    util.alert.message({message: result.data.message})
  }

  protected close() {
    this.node?.parent?.removeChild(this.node)
    this.node.destroy()
  }

}


