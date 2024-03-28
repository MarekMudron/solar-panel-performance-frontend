import * as THREE from "three"
import { getPanelGeometry,getPanelOutlineGeometry } from "./polygonFactory";
import { add } from "./Scene";
import { activatePanelAdder } from "./PanelAdder";
import { activatePanelFeedback } from "./PanelAdderFeedback";

export let currentPanel = null;

export const Orientation = {Vertical:"Vertical", Horizontal:"Horizontal"}

class Panel {
	constructor(template) {
		this.position = new THREE.Vector3();
		this.euler = new THREE.Euler();
		this.size = new THREE.Vector2(template.width, template.height)
		this.template = template;
		this.model = this.initModel();
		this.power = template.pp;
		this.tempCoef = template.pmpp;
		this.orientation = Orientation.Vertical;
	}

	initModel() {
		let g = new THREE.Group();
		const filling = getPanelGeometry(this.size);
		g.add(filling);
		const wireframe = getPanelOutlineGeometry(this.size);
		g.add(wireframe);
		g.userData.isPanel = true;
		g.userData.hoverColor = 0x13b3f2;
		g.userData.mainColor = 0x5fdeef;
		g.position.set(this.position.x, this.position.y, this.position.z)
		return g;
	}

	setPositionTo(pos3d) {
		this.position = pos3d;
		this.model.position.set(pos3d.x, pos3d.y, pos3d.z)
	}

	clone() {
		return new Panel(this.template)
	}


}

export function setActiveTemplate(template) {
	currentPanel = new Panel(template);
	add(currentPanel.model)
	activatePanelFeedback();
	activatePanelAdder();
}

export let panelBlocks = []
export let callbackOnAdded;

export function setOnPanelsAdded(fn) {
	callbackOnAdded = fn;
}

export function addPanelBlock(panels) {
	panelBlocks.push(panels);
	callbackOnAdded(panels);
	console.log(panelBlocks);
}
