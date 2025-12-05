import { _decorator, Component, Label, Node } from 'cc';
import { Map } from '../../scripts/database/Map';
const { ccclass, property } = _decorator;

@ccclass('PrefabSelectMapConfirm')
export class PrefabSelectMapConfirm extends Component {
  @property(Label)
  protected MapNameLabel: Label

  @property(Label)
  protected MapIntrouceLabel: Label

  private awaitResolve: any

  public async setMapSelect(option: Map) {
    this.MapNameLabel.string = option.name || ''
    this.MapIntrouceLabel.string = option.introduce || ''
    return new Promise<boolean>(res => {
      this.awaitResolve = res
    })
  }

  protected async onClickConfirm() {
    this.awaitResolve(true)
    this.node.parent.removeChild(this.node)
    this.node.destroy()
  }

  protected async onClickCancel() {
    this.awaitResolve(false)
    this.node.parent.removeChild(this.node)
    this.node.destroy()
  }
}


