import { _decorator, AudioSource, Component, Node, VideoPlayer } from 'cc';
import { rx } from '../../cc_module/rx';
import { Watch } from '../../cc_module/rx/core/effect/Watch';
import { GLOBAL_OPTION } from '../GLOBAL_OPTION';
import { ComponentExtension } from './ComponentExtension';
const { ccclass, property } = _decorator;

@ccclass('VideoSourceExtension')
@_decorator.requireComponent(VideoPlayer)
export class VideoSourceExtension extends ComponentExtension {
  protected start() {
    const videoPlayer = this.node.getComponent(VideoPlayer)
    const watch = rx.effect(() => videoPlayer.volume = GLOBAL_OPTION.volume)
    this.effects.push(watch)
  }
}


