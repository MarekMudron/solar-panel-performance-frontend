import { getPlaneKeypointsIntersect } from "../Raycaster.js"
import { Group } from "three"
import { canvas } from "../Canvas.js"
import { StitKeypoint } from "./StitKeypoint.js";
import { RoofKeypoint } from "./RoofKeypoint.js";


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
    let model = new Group();
    model.add(stitKeypoint.model);

    return model;
}
