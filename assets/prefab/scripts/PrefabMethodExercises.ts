import { _decorator, Component, Label, Node } from 'cc';
import { ComponentExtension } from '../../scripts/extension/ComponentExtension';
import { GLOBAL_OPTION } from '../../scripts/GLOBAL_OPTION';
import util from '../../cc_module/util';
import { MethodExercises } from '../../scripts/database/MethodExercises';
import { request, ResultData } from '../../scripts/request';
const { ccclass, property } = _decorator;

@ccclass('PrefabMethodExercises')
export class PrefabMethodExercises extends ComponentExtension {

  @property(Label)
  protected exercisesMethodLabel: Label

  @property(Label)
  protected levelLabel: Label

  @property(Label)
  protected introduceLabel: Label

  @property(Label)
  protected PowerLabel: Label

  @property(Label)
  protected BoneLabel: Label

  @property(Label)
  protected PhysiqueLabel: Label

  @property(Label)
  protected MovementLabel: Label
  
  @property(Label)
  protected ComprehensionLabel: Label

  @property(Label)
  protected WakanLabel: Label

  @property(Label)
  protected IconNameLabel: Label

  protected async start() {
    const close = await util.alert.loading()
    const result = await request.get<ResultData<MethodExercises>>("/api/role/getExercises")
    const exercisesMethod = result.data.data
    this.exercisesMethodLabel.string = '名称: ' + exercisesMethod.name
    this.levelLabel.string = '品阶: ' + exercisesMethod.level + '阶'
    this.introduceLabel.string = '简介: ' + exercisesMethod.introduce
    this.IconNameLabel.string = exercisesMethod.name
    close()

    this.effect(() => {
      this.PowerLabel.string = '功法提升真气: ' + Math.ceil(
        exercisesMethod.power * GLOBAL_OPTION.playerProperty.spiritRootLevel * 0.2 * exercisesMethod.level + exercisesMethod.power
      )
      this.BoneLabel.string = '功法提升根骨: ' + Math.ceil(
        exercisesMethod.bone * GLOBAL_OPTION.playerProperty.spiritRootLevel * 0.2 * exercisesMethod.level + exercisesMethod.bone
      )
      this.PhysiqueLabel.string = '功法提升体魄: ' + Math.ceil(
        exercisesMethod.physique * GLOBAL_OPTION.playerProperty.spiritRootLevel * 0.2 * exercisesMethod.level + exercisesMethod.physique
      )
      this.MovementLabel.string = '功法提升身法: ' + Math.ceil(
        exercisesMethod.movement * GLOBAL_OPTION.playerProperty.spiritRootLevel * 0.2 * exercisesMethod.level + exercisesMethod.movement
      )
      this.ComprehensionLabel.string = '功法提升悟性: ' + Math.ceil(
        exercisesMethod.comprehension * GLOBAL_OPTION.playerProperty.spiritRootLevel * 0.2 * exercisesMethod.level + exercisesMethod.comprehension
      )
      this.WakanLabel.string = '功法提升灵力: ' + Math.ceil(exercisesMethod.wakan + GLOBAL_OPTION.playerProperty.spiritRootLevel / 10 + exercisesMethod.level / 5)
    })
  }

  protected close() {
    this.node?.parent?.removeChild(this.node)
    this.node.destroy()
  }

}


