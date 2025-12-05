import { _decorator, Component, director, Label, Node, Prefab } from 'cc';
import { ComponentExtension } from '../../../extension/ComponentExtension';
import { rx } from '../../../../cc_module/rx';
import util from '../../../../cc_module/util';
import { native } from '../../../../cc_module/native';
import { request, ResultData } from '../../../request';
import { Map as MysqlMap } from './../../../database/Map'
const { ccclass, property } = _decorator;

@ccclass('ScenesLoadingCanvasLoadingProcessBox')
export class ScenesLoadingCanvasLoadingProcessBox extends ComponentExtension {

	@property(Label)
	private messageLabel: Label = null

	@property(Node)
	private processNode: Node = null

	private data = rx.reactive({
		process: 0,
	})

	protected start() {
		const watch = rx.effect(async () => {
			this.processNode.setScale(
				this.data.process / 100,
				this.processNode.scale.y
			)
		})
		this.effects.push(watch)
	}

	protected async onLoad() {
		this.data.process = 5
		await util.alert.preloadConfirm()
		this.data.process = 10
		await util.alert.preloadMessage()
		this.data.process = 15
		await util.alert.preloadLoading()
		const bundle = new native.AssetsManager("GloabelPrefab")
		await bundle.load("NumberUseBox", Prefab)
		this.data.process = 20
		await bundle.load("PackItem", Prefab)
		this.data.process = 25
		await bundle.load("Backpack", Prefab)
		this.data.process = 35
		await this.loadingMap()
		this.data.process = 100
		director.loadScene("login")
		return
	}

	protected async loadingMap() {
		const bundle = new native.AssetsManager()
		// 获取地图数据
    const mapResult = await request.get<ResultData<MysqlMap[]>>("/api/map/getMapByWorld" , {params: {"world": 1}})
		if (!mapResult) return util.alert.confirm({message: '网络连接错误，请检查网络连接后重新加入游戏'})
		const promises = []
		const mapImages = new Set<string>()
		mapResult.data.data.forEach(map => mapImages.add(map.mapImage))
		mapImages.forEach(map => promises.push(bundle.loadRemote(map)))
		await Promise.all(promises)
	}

}


