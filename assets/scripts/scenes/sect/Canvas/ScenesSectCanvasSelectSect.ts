import { _decorator, Color, Component, Node, Sprite } from 'cc';
import { ComponentExtension } from '../../../extension/ComponentExtension';
import { GLOBAL_OPTION } from '../../../GLOBAL_OPTION';
import util from '../../../../cc_module/util';
import { request, ResultData } from '../../../request';
const { ccclass, property } = _decorator;

@ccclass('ScenesSectCanvasSelectSect')
export class ScenesSectCanvasSelectSect extends ComponentExtension {

  @property({type: Node})
  protected selectSectContent: Node

  protected start() {
    this.effect(() => {
      const childrens = this.selectSectContent.children
      for (let i = 0; i < childrens.length; i++) {
        const children = childrens[i];
        if (i * 2 > GLOBAL_OPTION.playerProperty.realm) {
          const sprite = children.getComponent(Sprite)
          sprite.color = new Color(150,150,150)
        }
      }
    })
  }

  protected async selectJoinSect(event: any , customerArg: string) {
    const star = parseInt(customerArg)
    if (!star || (star - 1) * 2 > GLOBAL_OPTION.playerProperty.realm)
      return util.alert.message({message: '当前境界不足以加入这个等级的宗门'})
    const result = await request.post<ResultData<any>>("/api/sect/joinSectByStar" , { star })
    if (!result.data.status) return util.alert.message({message: result.data.message})
    
  }

}


