import { add, remove } from "../Scene";
import { getPerpendilarPlane } from "../polygonFactory";
import { addOp } from "../UndoRedo";
import { getIntersectWithMesh } from "../Raycaster";
import { camera } from "../Canvas";
import { Color } from "three";

export var roofKeypoints = [];


class RoofKeypoint {
    constructor(block) {
        this.block = block;
        this.model = this.block.roofGroup.children[0];
        this.model.userData.hoverColor = new Color(0x999999)
        this.model.userData.color = new Color(0x780000)
    }


    startCommand(intersect) {
        this.startBaseSize = this.block.baseSize.clone()
        this.plane = getPerpendilarPlane(intersect.point);
        add(this.plane)
        var lookat = camera.position.clone().setComponent(2, intersect.point.z);
        this.plane.lookAt(lookat);
        this.plane.updateMatrixWorld();
        this.originPointWC = intersect.point.clone();
    }

    performCommand() {
        var planeIP = getIntersectWithMesh(this.plane);
        var shiftz = planeIP.point.z - this.originPointWC.z
        this.size = this.startBaseSize.clone();
        this.size.z += shiftz
        //this.newHeight = this.size.z;
        this.block.setBaseHeight(this.size.z);
    }

    finishCommand() {
        remove(this.plane);
        addOp((state) => { state[0].setBaseHeight(state[1]) },
            (state) => { state[0].setBaseHeight(state[2]) },
            [this.block, this.size.z, this.startBaseSize.z])
    }
}

export function createKeypointFor(block) {
    let cp = new RoofKeypoint(block);
    roofKeypoints.push(cp)
    return cp
}