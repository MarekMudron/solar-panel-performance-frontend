import * as THREE from "three"
import { getPanelGeometry,getPanelOutlineGeometry } from "../polygonFactory";
import { add , remove} from "../Scene";
import { activatePanelAdder } from "./PanelAdder";
import { activatePanelFeedback } from "./PanelAdderFeedback";
import { deactivateDeleter } from "./PanelDeleter";

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
		this.mainColor = new THREE.Color(0x5fdeef)
		this.hoverColor = new THREE.Color(0x03fc4e)
	}

	initModel() {
		let g = new THREE.Group();
		const filling = getPanelGeometry(this.size);
		g.add(filling);
		const wireframe = getPanelOutlineGeometry(this.size);
		g.add(wireframe);
		g.userData.isPanel = true;
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

	setHighlighted(toHighlight) {
		if(toHighlight) {
			this.model.children[1].material.color = this.hoverColor;
		}else{
			this.model.children[1].material.color = this.mainColor;
		}
	}

	destroy() {
		remove(this.model)
	}


}

export function setActiveTemplate(template) {
	currentPanel = new Panel(template);
	add(currentPanel.model)
	activatePanelFeedback();
	deactivateDeleter();
	activatePanelAdder();
}

export let panelBlocks = []
export let callbackOnAdded;
