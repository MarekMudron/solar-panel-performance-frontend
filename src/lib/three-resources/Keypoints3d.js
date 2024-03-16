import { getIntersectWithMesh, getMapPlanePosition, getPlaneKeypointsIntersect } from "./Raycaster.js"
import { Group, Plane, SpriteMaterial, Sprite, MeshBasicMaterial, DoubleSide, BoxGeometry, PlaneGeometry, Mesh } from "three"
import { camera, canvas } from "./Canvas.js"
import { add, remove } from "./Scene.js";
import { PlaneKeypoint } from "./PlaneKeypoints.js";
import { CornerKeypoints } from "./CornerKeypoints.js";
import { EdgeKeypoints } from "./EdgeKeypoints.js";
import { SedlovaBlock } from "./Blocks.js";
import { getPerpendilarPlane } from "./polygonFactory.js";
import { addOp } from "./UndoRedo.js";


class StitKeypoint {
    constructor(block) {
        this.block = block;
        this.model = this.initModel();
    }

    initModel() {
        if (this.block instanceof SedlovaBlock) {
            const geometry = new BoxGeometry(1, 1, 1);
            const material = new MeshBasicMaterial({ color: 0x00ff00 });
            const cube = new Mesh(geometry, material);
            // cube.renderOrder = 10 || 999;
            // cube.material.depthTest = false;
            // cube.material.depthWrite = false;
            cube.position.setZ(1)
            cube.visible = false;
            cube.name = "stitKeypoint"
            cube.scale.set(1, 1, 1)
            return cube;
        }
    }

    startCommand(intersect) {
        this.startRoofHeight = this.block.heightRoof
        this.plane = getPerpendilarPlane(intersect.point);
        add(this.plane)
        var lookat = camera.position.clone().setComponent(2, intersect.point.z);
        this.plane.lookAt(lookat);
        this.plane.updateMatrixWorld();
    }

    performCommand() {

        var planeIP = getIntersectWithMesh(this.plane);

        var shiftz = planeIP.point.z;
        this.newHeight = shiftz - this.block.baseSize.z
        this.block.setHeightRoof(this.newHeight);
    }

    finishCommand() {
        remove(this.plane);
        addOp((state) => { state[0].setHeightRoof(state[1]) },
            (state) => { state[0].setHeightRoof(state[2]) },
            [this.block, this.newHeight, this.startRoofHeight])
    }
}


class RoofKeypoint {
    constructor(block) {
        this.block = block;
        this.model = this.block.roofGroup.children[0];
    }


    startCommand(intersect) {
        this.startBaseSize = this.block.baseSize.clone()
        this.plane = getPerpendilarPlane(intersect.point);
        add(this.plane)
        var lookat = camera.position.clone().setComponent(2, intersect.point.z);
        this.plane.lookAt(lookat);
        this.plane.updateMatrixWorld();
        this.originPointWC = intersect.point.clone();
        console.log(this.originPointWC);
    }

    performCommand() {
        var planeIP = getIntersectWithMesh(this.plane);
        var shiftz = planeIP.point.z - this.originPointWC.z
        //console.log("IP:", planeIP.point.z);
        this.size = this.startBaseSize.clone();
        this.size.z += shiftz 
        //this.newHeight = this.size.z;
        this.block.setBaseHeight(this.size.z);
    }

    finishCommand() {
        remove(this.plane);
        addOp((state) => { state[0].setBaseHeight(state[1]) },
            (state) => { state[0].setBaseHeight(state[2]) },
            [this.block,this.size.z, this.startBaseSize.z ])
    }
}


var currentOperation;
var stitKeypoints = [];
var roofKeypoints = [];

function startCommand() {
    let [intersect, keypoint] = getPlaneKeypointsIntersect(stitKeypoints, keypoint => {
        return [keypoint.model];
    });
    if (intersect != null) {
        currentOperation = keypoint
        currentOperation.startCommand(intersect);
        canvas.addEventListener("pointermove", performCommand);
        canvas.addEventListener("pointerup", finishCommand);
        return;
    }
    [intersect, keypoint] = getPlaneKeypointsIntersect(roofKeypoints, keypoint => {
        return [keypoint.model];
    });
    if (intersect != null) {
        currentOperation = keypoint
        currentOperation.startCommand(intersect);
        canvas.addEventListener("pointermove", performCommand);
        canvas.addEventListener("pointerup", finishCommand);
        return;
    }
}

function performCommand() {
    currentOperation.performCommand();
}

function finishCommand() {
    currentOperation.finishCommand();
    currentOperation = null;
    canvas.removeEventListener("pointermove", performCommand);
    canvas.removeEventListener("pointerup", finishCommand);
}


export function activate3dKeypoints() {
    canvas.addEventListener("pointerdown", startCommand);
    stitKeypoints.forEach(keypoint => {
        keypoint.model.visible = true;
    })
}

export function deactivate3dKeypoints() {
    canvas.removeEventListener("pointerdown", startCommand);
    canvas.removeEventListener("pointerup", finishCommand);
    stitKeypoints.forEach(keypoint => {
        keypoint.model.visible = false;
    })
}


export function createRoofKeypoints(block) {
    let stitKeypoint = new StitKeypoint(block);
    let roofKeypoint = new RoofKeypoint(block);
    stitKeypoints.push(stitKeypoint);
    roofKeypoints.push(roofKeypoint)
    let g = new Group();
    g.add(stitKeypoint.model);
    g.add(roofKeypoint.model);
    return g;
}
