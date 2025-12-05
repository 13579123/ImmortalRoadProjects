import { _decorator, Component, director, find, instantiate, Label, Node, NodeEventType, Prefab } from 'cc';
import { GLOBAL_OPTION } from '../../../GLOBAL_OPTION';
import { ComponentExtension } from '../../../extension/ComponentExtension';
import { request, ResultData } from '../../../request';
import util from '../../../../cc_module/util';
import { Map } from '../../../database/Map';
import { native } from '../../../../cc_module/native';
import { PrefabFightAnimation } from '../../../../prefab/scripts/PrefabFightAnimation';
import { PrefabSelectMapConfirm } from '../../../../prefab/scripts/PrefabSelectMapConfirm';
const { ccclass, property } = _decorator;

@ccclass('ScenesHumanMapCanvasUi')
export class ScenesHumanMapCanvasUi extends ComponentExtension {

  @property(Node)
  protected AllMapLevelContentNode: Node

  // 返回人界
  protected async returnHumanScenes() {
    director.loadScene("human")
  }
    
  protected async start() {
    const close = await util.alert.loading()
    // 获取地图数据
    const mapResult = await request.get<ResultData<Map[]>>("/api/map/getMapByWorld" , {params: {"world": 1}})
    close()
    if (!mapResult) return
    if (mapResult.data.code !== 200) {
      return util.alert.confirm({
        title: "错误",
        message: mapResult.data.message
      })
    }
    // 渲染地图数据
    const children = this.AllMapLevelContentNode.children
    const mapList = mapResult.data.data
    // 地图点击事件
    const mapClickEvent = (index: number) => {
      return async () => {
        GLOBAL_OPTION.currentMap = mapList[index]
        const bundle = new native.AssetsManager("GloabelPrefab")
        const SelectMapConfirmPrefab = await bundle.load("SelectMapConfirm", Prefab)
        const node = instantiate(SelectMapConfirmPrefab)
        const script = node.getComponent(PrefabSelectMapConfirm)
        find('Canvas').addChild(node)
        if (!(await script.setMapSelect(mapList[index]))) return
        director.loadScene("map")
      }
    }
    this.effect(() => {
      children.forEach((node , index) => {
        if (index <= (GLOBAL_OPTION.playerProperty.checkpointLevle % 15) && mapList[index]) 
          node.active = true
        else node.active = false
        node.getChildByName("Label").getComponent(Label).string = mapList[index]?.name
        node.on(NodeEventType.TOUCH_START , mapClickEvent(index))
      })
    })
  }

}


