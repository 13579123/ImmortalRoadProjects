import { _decorator, Color, Component, instantiate, Label, Node, Prefab, Sprite } from 'cc';
import { ComponentExtension } from '../../../extension/ComponentExtension';
import { request } from '../../../request';
import util from '../../../../cc_module/util';
import { native } from '../../../../cc_module/native';
import { RolePrefabSelect } from '../Prefab/scripts/RolePrefabSelect';
import { ScenesRoleCnvasBegain } from './ScenesRoleCanvasBegain';
import { rx } from '../../../../cc_module/rx';
const { ccclass, property } = _decorator;

@ccclass('ScenesRoleCanvasInfoSelect')
export class ScenesRoleCanvasInfoSelect extends ComponentExtension {

	@property(Node)
	protected layoutNode: Node

	@property(ScenesRoleCnvasBegain)
	protected scenesRoleCnvasBegain: ScenesRoleCnvasBegain

	@property(Label)
	protected IntroduceLabel: Label

	protected async start() {

		const close = await util.alert.loading()

		const result = await request.get<any>("/api/role/getRoleType")

		close()

		if (!result) util.alert.message({message: "无法获取信息，请尝试重新启动游戏"})

		if (result.data.code !== 200) {
      return util.alert.confirm({
        title: "错误",
        message: result.data.message
      })
    }

		const roleTypeList = result.data.data

		const rolePrefabBundle = new native.AssetsManager("RolePrefabResources")

		const prefab = await rolePrefabBundle.load("Select" , Prefab)

		roleTypeList.forEach((role: any) => {
			const node = instantiate(prefab)
			const rolePrefactSelect = node.getComponent(RolePrefabSelect)
			rolePrefactSelect.clickEvents.push(() => {
				this.layoutNode.children.forEach(node => node.getComponent(Sprite).color = new Color(190,190,190))
				this.scenesRoleCnvasBegain.data.role = role
				rolePrefactSelect.nodeSprite.color = new Color(255,255,255)
				this.IntroduceLabel.string = role.introduce
			})
			rolePrefactSelect.titleLabel.string = role.role
			this.layoutNode.addChild(node)
		})

	}

}
