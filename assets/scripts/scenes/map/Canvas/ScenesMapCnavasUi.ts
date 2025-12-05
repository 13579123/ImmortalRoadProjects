import { _decorator, Component, director, Node } from 'cc';
import { GLOBAL_OPTION } from '../../../GLOBAL_OPTION';
import util from '../../../../cc_module/util';
const { ccclass, property } = _decorator;

@ccclass('ScenesMapCnavasUi')
export class ScenesMapCnavasUi extends Component {

  protected async returnMapSelectScenes() {
    const result = await util.alert.confirm({message: '退出会清空当前进度，确定要返回吗?'})
    if (!result) return
    if (GLOBAL_OPTION.currentMap.mapWorld === 1)
      director.loadScene("human")
  }

}


