import { _decorator, Component, Label, Node, Size, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UtilAlertMessage')
export class UtilAlertMessage extends Component {

  @property(Label)
  public messageLable: Label

  @property(UITransform)
  private messageUITransform: UITransform

  @property(UITransform)
  private graphicsUITransform: UITransform

  private timeout: number = void 0

  protected start(): void {
    const inter = setInterval(() => {
      this.graphicsUITransform.setContentSize(new Size(
        this.graphicsUITransform.width + 10 * 2,
        this.graphicsUITransform.height ,
      ))
      if (this.graphicsUITransform.width >= 410) {
        clearInterval(inter)
        this.timeout = setTimeout(() => this.node.parent?.removeChild(this.node), 3000)
      }
    } , 20)
  }

  protected onDestroy(): void {
    clearTimeout(this.timeout)
  }
}


