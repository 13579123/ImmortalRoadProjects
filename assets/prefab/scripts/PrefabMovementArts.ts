import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { ComponentExtension } from '../../scripts/extension/ComponentExtension';
import { MovementMatialArts } from '../../scripts/database/MovementsMartialArts';
import { request, ResultData } from '../../scripts/request';
import util from '../../cc_module/util';
import { native } from '../../cc_module/native';
import { PrefabMovementArtItem } from './PrefabMovementArtItem';
import { GLOBAL_OPTION } from '../../scripts/GLOBAL_OPTION';
import { flashPlaterProperty } from '../../scripts/tool/flashPlayerProperty';
const { ccclass, property } = _decorator;

@ccclass('PrefabMovementArts')
export class PrefabMovementArts extends ComponentExtension {

  @property(Node)
  protected ContentLayout: Node

  protected async reflashMovementArts() {
    // 刷新用户信息
    if (!await flashPlaterProperty()) return
    // 获取所有的招式
    const result = await request.get<ResultData<MovementMatialArts[]>>("/api/role/getHasLearnUserMovement")
    if (!result) return
    if (!result.data.status) return util.alert.message({message: result.data.message})
    // 清除原来所有的节点
    this.ContentLayout.removeAllChildren()
    // 渲染招式
    result.data.data.forEach(async movementMatialArt => {
      const bundle = new native.AssetsManager("GloabelPrefab")
      const prefab = await bundle.load("MovementArtItem" , Prefab)
      const node = instantiate(prefab)
      const prefabMovementArtItemScript = node.getComponent(PrefabMovementArtItem)
      const onClickUseCallback = async () => {
        const close = await util.alert.loading()
        // 发起使用招式的请求
        const result = await request.post<ResultData<any>>("/api/role/useMovementArt" , {movementArtId: movementMatialArt.id})
        if (!result) return
        util.alert.message({message: result.data.message})
        await this.reflashMovementArts()
        close()
      }
      prefabMovementArtItemScript.setMovementArt(
        movementMatialArt , 
        GLOBAL_OPTION.playerProperty.movementArtsId !== movementMatialArt.id , 
        onClickUseCallback
      )
      this.ContentLayout.addChild(node)
    })
  }

  protected async start() {
    const close = await util.alert.loading()
    await this.reflashMovementArts()
    close()
  }

  protected closeMovementArts() {
    this.node.parent.removeChild(this.node)
    this.node.destroy()
  }

}

