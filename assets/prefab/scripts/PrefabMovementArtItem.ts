import { _decorator, Component, ImageAsset, Label, Node, RichText, Sprite, SpriteFrame, Texture2D } from 'cc';
import { ComponentExtension } from '../../scripts/extension/ComponentExtension';
import { MovementMatialArts } from '../../scripts/database/MovementsMartialArts';
import { native } from '../../cc_module/native';
const { ccclass, property } = _decorator;

@ccclass('PrefabMovementArtItem')
export class PrefabMovementArtItem extends ComponentExtension {

  @property(Sprite)
  protected IconSprite: Sprite

  @property(Label)
  protected NameLabel: Label

  @property(Label)
  protected IntroduceLabel: Label

  @property(Node)
  protected UseBtnNode: Node

  protected movementArt: MovementMatialArts

  protected useClick: (movementArt: MovementMatialArts) => any

  public async setMovementArt(movementArt: MovementMatialArts , show: boolean , useClick: (movementArt: MovementMatialArts) => any) {
    this.movementArt = movementArt
    this.NameLabel.string = movementArt.name + ` ${movementArt.level <= 0 ? 1 : movementArt.level}阶`
    this.IntroduceLabel.string = movementArt.introduce;
    if (movementArt.icon) {
      const bundle = new native.AssetsManager()
      const promise = bundle.loadRemote<ImageAsset>(movementArt.icon)
      promise.then((imageAsset) => {
        const spriteFrame = new SpriteFrame();
        const texture = new Texture2D();
        texture.image = imageAsset;
        spriteFrame.texture = texture
        this.IconSprite.spriteFrame = spriteFrame
      }).catch(e => console.log(e))
    }
    this.UseBtnNode.active = show
    this.useClick = useClick
  }

  protected onUseClick() {
    if (this.useClick) this.useClick(this.movementArt)
  }

}


