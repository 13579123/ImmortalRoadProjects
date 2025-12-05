import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UtilAlertLoading')
export class UtilAlertLoading extends Component {

  @property(Label)
  public messageLable: Label

}


