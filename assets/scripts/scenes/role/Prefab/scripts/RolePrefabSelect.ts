import { _decorator, Component, Label, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RolePrefabSelect')
export class RolePrefabSelect extends Component {

  @property(Label)
  public titleLabel: Label


  @property(Sprite)
  public nodeSprite: Sprite

  public clickEvents: any[] = []

  protected onClick() {
    this.clickEvents.forEach(c => c())
  }

}


