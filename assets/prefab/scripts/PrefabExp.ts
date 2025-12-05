import { _decorator, Component, error, Label, Node, NodeEventType, Toggle } from 'cc';
import util from '../../cc_module/util';
import { GLOBAL_OPTION } from '../../scripts/GLOBAL_OPTION';
import { ComponentExtension } from '../../scripts/extension/ComponentExtension';
import { request } from '../../scripts/request';
import { flashPlaterProperty } from '../../scripts/tool/flashPlayerProperty';
const { ccclass, property } = _decorator;

@ccclass('PrefabExp')
export class PrefabExp extends ComponentExtension {

  @property(Label)
  private timeExpLabel: Label

  @property(Label)
  private expLabel: Label

  @property(Node)
  private ProgressBarNode: Node

  @property(Node)
  private CultivateNode: Node

  @property(Label)
  private AddExpLabel: Label

  @property(Toggle)
  private AutoCultivateToggle: Toggle

  protected async start() {
    this.effect(() => {
      if (!GLOBAL_OPTION.playerProperty) return
      const timeExp = GLOBAL_OPTION.playerProperty.comprehension / 2 + 5;
      this.timeExpLabel.string = `修炼效率(${Math.floor(timeExp * 0.7)}~${Math.floor(timeExp * 1.1)})/5秒`
    })
    this.effect(() => {
      if (!GLOBAL_OPTION.playerProperty) return
      this.expLabel.string = `总修为 ${GLOBAL_OPTION.playerProperty.exp}`
    })
    this.effect(() => {
      if (
        GLOBAL_OPTION.playerProperty?.autoCultivation !== -1 
        &&
        GLOBAL_OPTION.playerProperty.autoCultivation <= new Date(GLOBAL_OPTION.playerProperty.lastUpExpTime).getTime()
      ) this.CultivateNode.active = true
      else this.CultivateNode.active = false
    })
    this.AutoCultivateToggle.isChecked = (GLOBAL_OPTION.playerProperty.autoCultivation === -1)
  }

  private lastUpdateExp = Date.now()

  private isLoading = false

  protected async update(dt: number) {
    if (this.isLoading) return
    if (
      GLOBAL_OPTION.playerProperty?.autoCultivation !== -1 
      &&
      GLOBAL_OPTION.playerProperty.autoCultivation <= new Date(GLOBAL_OPTION.playerProperty.lastUpExpTime).getTime()
    ) return this.ProgressBarNode.setScale(0 , this.ProgressBarNode.scale.y)
    const now = Date.now()
    if (now - this.lastUpdateExp >= 10000) {
      this.isLoading = true
      // 获取修为增加的状态
      request.get<any>("/api/role/getRoleProperty").then(result => {
        this.isLoading = false
        this.lastUpdateExp = Date.now()
        if (!result) return
        if (result.data.code !== 200) return util.alert.message({message: result.data.message})
        console.log(result.data.data.exp , GLOBAL_OPTION.playerProperty.exp , result.data.data.exp - GLOBAL_OPTION.playerProperty.exp)
        if (result.data.data.exp - GLOBAL_OPTION.playerProperty.exp < 0) {
          Object.keys(GLOBAL_OPTION.playerProperty).forEach(k => GLOBAL_OPTION.playerProperty[k] = result.data.data[k])
          return 
        }
        this.AddExpLabel.node.active = true
        this.AddExpLabel.string = `修为增加 + ${result.data.data.exp - GLOBAL_OPTION.playerProperty.exp}`
        Object.keys(GLOBAL_OPTION.playerProperty).forEach(k => GLOBAL_OPTION.playerProperty[k] = result.data.data[k])
        this.AddExpLabel.node.setPosition(0 , 130)
        const stopInter = this.setAutoInterval(() => {
          this.AddExpLabel.node.setPosition(0 , this.AddExpLabel.node.position.y + 1.5)
          if (this.AddExpLabel.node.position.y >= 200) {
            this.AddExpLabel.node.active = false
            stopInter()
          }
        } , 5)
      }).catch(e => { this.isLoading = false;error(e) })
      this.lastUpdateExp = now
    }
    this.ProgressBarNode.setScale((now - this.lastUpdateExp) / 10000 , this.ProgressBarNode.scale.y)
  }

  // 开始修炼
  protected async startCultivate() {
    const close = await util.alert.loading()
    const result = await request.post<any>("/api/role/startCultivate")
    await flashPlaterProperty()
    close()
    if (!result) return
    if (result.data.code !== 200) {
      return util.alert.confirm({
        title: "错误",
        message: result.data.message
      })
    }
  }

  // 自动修炼改变
  protected async changeAutoCultivate() {
    let isAuto = this.AutoCultivateToggle.isChecked ? 'stop' : 'auto'
    const confirm = await util.alert.confirm({message: "元婴期修士可以元婴入定自动修炼"})
    if (!confirm) return this.AutoCultivateToggle.isChecked = (GLOBAL_OPTION.playerProperty.autoCultivation === -1)
    const close = await util.alert.loading()
    const result = await request.post<any>("/api/role/autoCultivate" , { type: isAuto })
    await flashPlaterProperty()
    this.AutoCultivateToggle.isChecked = (GLOBAL_OPTION.playerProperty.autoCultivation === -1)
    close()
    if (!result) return
    if (result.data.code !== 200) {
      return util.alert.confirm({
        title: "错误",
        message: result.data.message
      })
    }
    util.alert.message({message: result.data.message})
    this.AutoCultivateToggle.isChecked = (GLOBAL_OPTION.playerProperty.autoCultivation === -1)
  }

}




