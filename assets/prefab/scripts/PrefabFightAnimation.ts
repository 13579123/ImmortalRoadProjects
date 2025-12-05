import { _decorator, Animation, AnimationClip, Component, find, instantiate, Label, Node, Prefab, RichText, Skeleton, sp } from 'cc';
import { ComponentExtension } from '../../scripts/extension/ComponentExtension';
import { Monster } from '../../scripts/database/Monster';
import { Item } from '../../scripts/database/Item';
import { rx } from '../../cc_module/rx';
import { GLOBAL_OPTION } from '../../scripts/GLOBAL_OPTION';
import util from '../../cc_module/util';
import { native } from '../../cc_module/native';
import { PrefabShowGainItem } from './PrefabShowGainItem';
import { MovementMatialArts } from '../../scripts/database/MovementsMartialArts';
const { ccclass, property } = _decorator;

interface FightState {
	hp: number,
	maxHp: number,
	attack: number,
	defense: number,
	speed: number,
	criticalHitRate: number,
  // 使用招式
  movementArts: MovementMatialArts
}

interface FightRoundState {
	round: number,
	// 行动方
	active: "player" | "monster",
	// 是否暴击
	isCriticalHit: boolean,
	// 是否闪避
	isMiss: boolean,
	// 造成伤害
	hurt: number,
	// 剩余状态
	player: FightState,
	monster: FightState,
}

interface dropItem { itemId: number, number: number, item: Item | null }

@ccclass('PrefabFightAnimation')
export class PrefabFightAnimation extends ComponentExtension {

	@property(sp.Skeleton)
	protected PlayerSpine: sp.Skeleton

	@property(sp.Skeleton)
	protected MonsterSpine: sp.Skeleton

	@property(Node)
	protected PlayerHpNode: Node

	@property(Node)
	protected MonsterHpNpde: Node

	@property(Node)
	protected SkipBtnNode: Node

	@property(RichText)
	protected MessageContentLabel: RichText

	protected skipFight: boolean = false

	public skipFightClick() {
		this.skipFight = true
		this.SkipBtnNode.parent.removeChild(this.SkipBtnNode)
	}

	public async playRoundState(success: boolean, monster: Monster, dropItems: dropItem[], fightStateReuslt: FightRoundState[] , skipAnimation = false) {
		this.MessageContentLabel.string = ''
		let activeSpine: sp.Skeleton , otherSpine: sp.Skeleton
		// 播放动画
		if (!skipAnimation) {
			for (let i = 0; i < fightStateReuslt.length; i++) {
				const fightState = fightStateReuslt[i]
				activeSpine = fightState.active === 'player' ? this.PlayerSpine : this.MonsterSpine
				otherSpine = fightState.active === 'monster' ? this.PlayerSpine : this.MonsterSpine
				const xMove = activeSpine.node.scale.x > 0 ? 3 : -3
				if (this.skipFight) break
				// 行动缓冲
				await new Promise(res => setTimeout(res, 500))
				// 等待移动
				await new Promise(res => {
					let moveCount = 0
					const clear = this.setAutoInterval(() => {
						activeSpine.node.setPosition(activeSpine.node.position.x + xMove, activeSpine.node.position.y)
						moveCount++
						if (moveCount >= (180 + 80) / 3) {
							clear()
							res(void 0)
						}
					} , 5)
				})
				// 新增消息
				let message = '<color=#000000>'
				message +=	`<color=#E6A23C>${activeSpine === this.PlayerSpine ? GLOBAL_OPTION.playerAccount.nickname : monster.name}</color>`
					+`气势如虹，出手向<color=#E6A23C>${
						activeSpine === this.PlayerSpine ? monster.name : GLOBAL_OPTION.playerAccount.nickname
					}</color>`
					+`使用了一招<color=#67C23A>${
						activeSpine === this.PlayerSpine ? fightState.player.movementArts.name : fightState.monster.movementArts.name
					}</color>，`
				if (fightState.isMiss) {
					message += `<color=#E6A23C>${activeSpine === this.PlayerSpine ? monster.name : GLOBAL_OPTION.playerAccount.nickname}</color>`
					+`身法灵活，躲开了这危险的攻击`
				} else if (fightState.isCriticalHit) {
					message += `<color=#E6A23C>${activeSpine === this.PlayerSpine ? monster.name : GLOBAL_OPTION.playerAccount.nickname}</color>`
					+`吐出一口鲜血，这一道攻击对他造成了<color=#F56C6C>${fightState.hurt}</color>的暴击伤害`
				} else {
					message += `<color=#E6A23C>${activeSpine === this.PlayerSpine ? monster.name : GLOBAL_OPTION.playerAccount.nickname}</color>`
					+`闷哼一声，受到了<color=#F56C6C>${fightState.hurt}</color>的伤害`
				}
				message += '</color>\n\n'
				// 增加状态
				this.MessageContentLabel.string = message + this.MessageContentLabel.string
				// 播放动画
				await new Promise(res => {
					activeSpine.setAnimation(1, 'attack', false)
					activeSpine.setCompleteListener(() => {
						activeSpine.setAnimation(1, 'idel', true)
						activeSpine.setCompleteListener(null)
						res(void 0)
					})
				})
				// 更新状态
				this.PlayerHpNode.setScale(fightState.player.hp / fightState.player.maxHp, this.PlayerHpNode.scale.y)
				this.MonsterHpNpde.setScale(fightState.monster.hp / fightState.monster.maxHp, this.MonsterHpNpde.scale.y)
				// 扣血或者闪避动画
				const hurtNode = otherSpine.node.getChildByName("Hurt")
				if (fightState.isMiss)
					hurtNode.getComponent(Label).string = 'Miss'
				else if (fightState.isCriticalHit)
					hurtNode.getComponent(Label).string = '暴击 -' + fightState.hurt
				else
					hurtNode.getComponent(Label).string = '-' + fightState.hurt
				// 播放动画
				const animationComponent = hurtNode.getComponent(Animation)
				animationComponent.on(Animation.EventType.FINISHED, () => {
					hurtNode.active = false
					animationComponent.off(Animation.EventType.FINISHED)
				})
				hurtNode.active = true
				animationComponent.play()
				// 回到位置
				const promise = new Promise(res => {
					let moveCount = 0
					const clear = this.setAutoInterval(() => {
						activeSpine.node.setPosition(activeSpine.node.position.x - xMove, activeSpine.node.position.y)
						moveCount++
						if (moveCount >= (180 + 80) / 3) {
							clear()
							res(void 0)
						}
					} , 5)
				})
				if (fightStateReuslt[i + 1]) await promise
			}
			// 死亡动画
			if (fightStateReuslt[fightStateReuslt.length -1].player.hp <= 0)
				this.PlayerSpine.setAnimation(1, 'death', false)
			if (fightStateReuslt[fightStateReuslt.length -1].monster.hp <= 0)
				this.MonsterSpine.setAnimation(1, 'death', false)
	
			if (!this.skipFight) await new Promise(res => setTimeout(res, 1000))
		}
		if (!success) util.alert.confirm({ title: '战败', message: '敌人展现出强大的实力，你战败后只能头也不回的向远处逃遁。' })
		this.node.active = false
		// 获取物品
		if (dropItems.length <= 0) return
		const bundle = new native.AssetsManager("GloabelPrefab")
		const ShowGainItemPrefab = await bundle.load("ShowGainItem", Prefab)
		const node = instantiate(ShowGainItemPrefab)
		const PrefabShowGainItemScript = node.getComponent(PrefabShowGainItem)
		find('Canvas').addChild(node)
		await PrefabShowGainItemScript.showGainItem(dropItems)
		return
	}

}


