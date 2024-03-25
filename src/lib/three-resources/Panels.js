import { canvas } from "./Canvas";
import { getIntersectWithRoofs } from "./Raycaster";
import { deactivate2dKeypoints } from "./keypoints-2d/Keypoints2d";
import { deactivate3dKeypoints } from "./keypoints-3d/Keypoints3d";
import * as THREE from "three"
import { getPanelGeometry } from "./polygonFactory";
import { add } from "./Scene";

export let panels = []

class Panel {
	constructor(pos2d, size) {
		this.position = pos2d; // world pos
		this.size = size;
		this.euler = new THREE.Euler();
		this.model = this.initModel();
	}

	initModel() {
		let g = new THREE.Group();
		const filling = getPanelGeometry(this.size);
		g.add(filling);
		var wgeo = new THREE.EdgesGeometry(filling.geometry);
		var wmat = new THREE.LineBasicMaterial({ color: 0x000000 });
		var wireframe = new THREE.LineSegments(wgeo, wmat);
		g.add(wireframe);
		g.userData.isPanel = true;
		g.userData.hoverColor = 0x13b3f2;
		g.userData.mainColor = 0x5fdeef;
        g.position.set(this.position.x, this.position.y, this.position.z)
		return g;
	}
}

function putPanel() {
    var [intersect, block] = getIntersectWithRoofs();
    if(intersect != null) {
        let panelPos = intersect.point
        let faceIndex = intersect.faceIndex
        let panel = new Panel(panelPos, new THREE.Vector2(1,2));
       
        if(block.alignPanel(panel, faceIndex)) {
            add(panel.model)
            panels.push(panel)
        }
    }    
}

function showPreview() {
    //var ib = getIntersectWithRoofs();
    //console.log(ib[0].point);
}

function startArea() {
	let roofIP = getIntersectWithRoofs();
	let planePosition = roofIP[0].point;
	let dirVec = new THREE.Vector3(Math.cos(this.block.azimuth), Math.sin(this.block.azimuth), 0);
	let faceIndex = roofIP[0].faceIndex
	let planeNormal = 

}

export function addPanel() {
    deactivate2dKeypoints();
    deactivate3dKeypoints()
	canvas.addEventListener("pointerdown", startArea)
    canvas.addEventListener("pointerup", putPanel);
    canvas.addEventListener("pointermove", showPreview);
}