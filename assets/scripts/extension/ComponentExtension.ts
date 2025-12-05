import { Component } from "cc";
import { ReactiveEffectOptions, ReactiveEffectRunner } from "../../cc_module/rx/reactivity";
import { rx } from "../../cc_module/rx";

export class AutoInterval {
  timer?: number
  count?: number
}

export class ComponentExtension extends Component {

  // 所有响应式监听对象
  private effects: ReactiveEffectRunner[] = []
  
  // 所有的定时器
  private autoIntervalSet = new Set<number>()

  // 响应式监听函数
  protected effect(callback: () => void , option?: ReactiveEffectOptions): ReactiveEffectRunner {

    // 节流
    let isEffecting = false
    option = {
      scheduler: () => {
        if (isEffecting) return
        isEffecting = true
        this.setAutoInterval(() => {
          runner()
          isEffecting = false
        } , {count: 1 , timer: 15})
      } , 
      ...option
    }
    const runner = rx.effect(callback , option)
    this.effects.push(runner)
    return runner
  }

  // 设置定时器
  protected setAutoInterval(call: Function , option: AutoInterval|number = {}) {
    if (typeof option === 'number') option = {timer: option}
    let count = option.count || -1
    const timer = option.timer || 1000
    const close = () => {
      clearInterval(inter)
      this.autoIntervalSet.delete(inter)
    }
    const inter = setInterval(() => {
      if (count === 0) return close()
      if (count > -1) count--
      call()
    } , timer)
    this.autoIntervalSet.add(inter)
    return close
  }

  // 当销毁时
  protected onDestroy(): void {
    // 清空所有的定时器
    this.autoIntervalSet.forEach(inter => clearInterval(inter))
    // 清空所有的响应式监听
    this.effects.forEach(effect => {
      if (effect) effect.effect.stop()
    })
    this.effects = []
  }

}