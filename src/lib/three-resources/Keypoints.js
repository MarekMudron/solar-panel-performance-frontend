import { getMapPlanePosition, getPlaneKeypointsIntersect } from "./Raycaster.js"
import { Group, Plane,SpriteMaterial, Sprite,MeshBasicMaterial, DoubleSide, PlaneGeometry, Mesh } from "three"
import { canvas } from "./Canvas.js"
import { add } from "./Scene.js";
import { PlaneKeypoint } from "./PlaneKeypoints.js";
import { CornerKeypoints } from "./CornerKeypoints.js";
import { EdgeKeypoints } from "./EdgeKeypoints.js";



function startCommand() {
    let [intersect, keypoint] = getPlaneKeypointsIntersect(cornerKeypoints, keypoint => {
        return keypoint.model.children;
    });
    if (intersect != null) {
        currentOperation = keypoint
        currentOperation.startCommand();
        canvas.addEventListener("pointermove", performCommand);
        canvas.addEventListener("pointerup", finishCommand);
        return;
    }

    [intersect, keypoint] = getPlaneKeypointsIntersect(edgeKeypoints, keypoint => {
        return keypoint.model.children;
    });
    if (intersect != null) {
        currentOperation = keypoint
        currentOperation.startCommand(intersect);
        canvas.addEventListener("pointermove", performCommand);
        canvas.addEventListener("pointerup", finishCommand);
        return;
    }

    [intersect, keypoint] = getPlaneKeypointsIntersect(planeKeypoints, keypoint => {
        return [keypoint.model];
    });
    if (intersect != null) {
        currentOperation = keypoint
        currentOperation.startCommand(intersect);
        canvas.addEventListener("pointermove", performCommand);
        canvas.addEventListener("pointerup", finishCommand);
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







export function activateKeypoints() {
    canvas.addEventListener("pointerdown", startCommand);
    

}

export function deactivateKeypoints() {
    canvas.removeEventListener("pointerdown", startCommand);
    canvas.removeEventListener("pointerup", finishCommand);
}


var currentOperation;
var planeKeypoints = [];
var cornerKeypoints = [];
var edgeKeypoints = [];

export function createKeypoints(block) {

    let planeKeypoint = new PlaneKeypoint(block);
    let cornerKeypoint = new CornerKeypoints(block);
    let edgeKeypoint = new EdgeKeypoints(block);
    planeKeypoints.push(planeKeypoint);
    cornerKeypoints.push(cornerKeypoint);
    edgeKeypoints.push(edgeKeypoint);
    let g = new Group();
    g.add(planeKeypoint.model);
    g.add(cornerKeypoint.model);
    g.add(edgeKeypoint.model);
    return g;
}
