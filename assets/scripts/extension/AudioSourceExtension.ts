import { _decorator, AudioSource, Component, Node } from 'cc';
import { rx } from '../../cc_module/rx';
import { Watch } from '../../cc_module/rx/core/effect/Watch';
import { GLOBAL_OPTION } from '../GLOBAL_OPTION';
import { ComponentExtension } from './ComponentExtension';
const { ccclass, property } = _decorator;

@ccclass('AudioComponents')
@_decorator.requireComponent(AudioSource)
export class AudioComponents extends ComponentExtension {

  protected start() {
    const audioSource = this.node.getComponent(AudioSource)
    const watch = rx.effect(() => audioSource.volume = GLOBAL_OPTION.volume )
    this.effects.push(watch)
  }

}


