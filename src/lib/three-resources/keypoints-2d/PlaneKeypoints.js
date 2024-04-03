import { PlaneGeometry, MeshBasicMaterial, Mesh, DoubleSide } from "three";
import { getMapPlanePosition } from "../Raycaster";
import { addOp } from "../UndoRedo";
import { fadeAll, unfadeAll } from "../Site";


export var planeKeypoints = [];

class PlaneKeypoint {
    constructor(block) {
        this.block = block;
        this.model = this.initModel();

    }

    initModel() {
        const geometry = new PlaneGeometry(1, 1);
        const material = new MeshBasicMaterial({ visible: false, transparent: true, opacity: 0.5, color: 0xffffff, side: DoubleSide });
        const plane = new Mesh(geometry, material);
        plane.name = "Keypoint Mesh"
        plane.renderOrder = 3;
        plane.material.depthTest = false;
        plane.material.depthWrite = false;
        plane.position.setZ(0);
        plane.updateMatrixWorld()
        return plane;
    }

    startCommand() {
        this.startHousePos = this.block.position.clone()
        var cursorOnPlanePos = getMapPlanePosition();
        this.diffVec = {};
        this.diffVec.x = this.block.position.x - cursorOnPlanePos.x;
        this.diffVec.y = this.block.position.y - cursorOnPlanePos.y;
        fadeAll()
    }

    performCommand() {
        var posOnPLane = getMapPlanePosition();
        this.finalPos = { x: posOnPLane.x + this.diffVec.x, y: posOnPLane.y + this.diffVec.y };
        this.block.moveHorizontally(this.finalPos);
    }

    finishCommand() {
        unfadeAll()
        addOp((state) => { state[0].moveHorizontally(state[1]) },
            (state) => { state[0].moveHorizontally(state[2]) },
            [this.block, this.finalPos, this.startHousePos,])
    }
}


export function createKeypointFor(block) {
    let cp = new PlaneKeypoint(block);
    planeKeypoints.push(cp)
    return cp
}

export function removePlaneKPFor(block) {
    planeKeypoints = planeKeypoints.filter(element => element.block !== block);
}