import { _decorator, Component, director, find, instantiate, Node, Prefab } from 'cc';
import util from '../../../../cc_module/util';
import { native } from '../../../../cc_module/native';
import { FolkPrescription } from '../../../database/FolkPrescription';
import { PrefabFolkPrescription } from '../../../../prefab/scripts/PrefabFolkPrescription';
const { ccclass, property } = _decorator;

@ccclass('ScenesHumanCanvasHumanUi')
export class ScenesHumanCanvasHumanUi extends Component {

  protected async openHumanMap() {
    director.loadScene('humanMap')
  }

  // 开启丹房
  protected async openFolkPrescription() {
    const close = await util.alert.loading()
    const bundle = new native.AssetsManager("GloabelPrefab")
    const prefab = await bundle.load("FolkPrescription" , Prefab)
    const node = instantiate(prefab)
    find("Canvas").addChild(node)
    close()
  }

  // 开启器房
  protected async openChain() {
    const close = await util.alert.loading()
    const bundle = new native.AssetsManager("GloabelPrefab")
    const prefab = await bundle.load("FolkPrescription" , Prefab)
    const node = instantiate(prefab)
    node.getComponent(PrefabFolkPrescription).reactiveData.type = 1
    find("Canvas").addChild(node)
    close()
  }

  // 开启门派
  protected async openSect() {
    director.loadScene('sect')
  }

}


