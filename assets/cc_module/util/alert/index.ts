import { Color, Prefab, find, instantiate, Node } from "cc"
import { AssetsManager } from "../../native/assets/AssetsManager"
import { UtilAlertConfirm } from "./prefab/confirm/scripts/UtilAlertConfirm"
import { UtilAlertMessage } from "./prefab/message/scripts/UtilAlertMessage"
import { UtilAlertLoading } from "./prefab/loading/scripts/UtilAlertLoading"

type ConfirmOption = {
  title?: string,
  message?: string,
}
async function confirm(option: ConfirmOption = {}): Promise<boolean> {
  const bundle = new AssetsManager("ModuleUtilAlertConfirmResource")
  const prefab = await bundle.load("Confirm" , Prefab)
  const node = instantiate(prefab)
  const script = node.getComponent(UtilAlertConfirm)
  if (option.title) script.titleLabel.string = option.title
  if (option.message) script.messageLabel.string = option.message
  find("Canvas").addChild(node)
  return new Promise(res => {
    script.onCancelCallback.push(() => res(false))
    script.onConfirmCallback.push(() => res(true))
  })
}
function preloadConfirm() {  
  const bundle = new AssetsManager("ModuleUtilAlertConfirmResource")
  return bundle.load("Confirm" , Prefab)
}

type MessageOption = {
  message: string,
  color?: Color,
}
let lastMessageNode: Node = null
async function message(option: MessageOption) {
  if (lastMessageNode) lastMessageNode.parent?.removeChild(lastMessageNode)
  const bundle = new AssetsManager("ModuleUtilAlertMessageResource")
  const prefab = await bundle.load("Message" , Prefab)
  const node = lastMessageNode = instantiate(prefab)
  const script = node.getComponent(UtilAlertMessage)
  script.messageLable.string = option.message
  if (option.color) script.messageLable.color = option.color
  find("Canvas").addChild(node)
  node.setPosition(0,200)
}
function preloadMessage() {  
  const bundle = new AssetsManager("ModuleUtilAlertMessageResource")
  return bundle.load("Message" , Prefab)
}

type LoadingOption = {
  message?: string
}
async function loading(option: LoadingOption = {}): Promise<Function> {
  const bundle = new AssetsManager("ModuleUtilAlertLoadingResource")
  const prefab = await bundle.load("Loading" , Prefab)
  const node = instantiate(prefab)
  const script = node.getComponent(UtilAlertLoading)
  if (option.message) script.messageLable.string = option.message
  find("Canvas").addChild(node)
  return () => {
    if (node.parent) node.destroy()
    node.parent?.removeChild(node)
  }
}
function preloadLoading() {
  const bundle = new AssetsManager("ModuleUtilAlertLoadingResource")
  return bundle.load("Loading" , Prefab)
}

export default {
  confirm,
  preloadConfirm,
  message,
  preloadMessage,
  loading,
  preloadLoading,
}