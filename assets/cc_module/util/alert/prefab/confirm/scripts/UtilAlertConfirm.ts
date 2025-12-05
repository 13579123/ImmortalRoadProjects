import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UtilAlertConfirm')
export class UtilAlertConfirm extends Component {

  public onCancelCallback: Function[] = []

  public onConfirmCallback: Function[] = []

  @property(Label)
  titleLabel: Label

  @property(Label)
  messageLabel: Label

  onConfirm() {
    this.onConfirmCallback.forEach(c => c())
    this.node.destroy()
  }

  onCancel() {
    this.onCancelCallback.forEach(c => c())
    this.node.destroy()
  }

}


