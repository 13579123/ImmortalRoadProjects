import { _decorator, Component, Label, Node } from 'cc';
import { ComponentExtension } from '../../scripts/extension/ComponentExtension';
import { Monster } from '../../scripts/database/Monster';
const { ccclass, property } = _decorator;

@ccclass('PrefabFightMonsterConfirm')
export class PrefabFightMonsterConfirm extends ComponentExtension {

  protected awaitList: any[] = []

  protected userSelect: boolean|undefined = void 0

  protected onCancelClick() {
    if (this.userSelect !== void 0) return
    this.userSelect = false
    this.awaitList.forEach(f => f(this.userSelect))
  }

  protected onConfirmClick() {
    if (this.userSelect !== void 0) return
    this.userSelect = true
    this.awaitList.forEach(f => f(this.userSelect))
  }

  @property(Label)
  protected NameLabel: Label
  
  @property(Label)
  protected IntroduceLabel: Label

  public async getUserSelect(monster: Monster): Promise<boolean> {
    this.NameLabel.string = monster.name
    this.IntroduceLabel.string = monster.introduce

    return new Promise<boolean>((res) => {
      if (this.userSelect !== void 0) return res(this.userSelect)
      this.awaitList.push(res)
    })
  }

}


