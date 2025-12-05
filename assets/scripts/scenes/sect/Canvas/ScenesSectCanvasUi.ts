import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScenesSectCanvasUi')
export class ScenesSectCanvasUi extends Component {

	protected returnHumanScense() {
		director.loadScene("human")
	}

}


