import { getClosestIntersect } from "../Raycaster.js"
import { Group } from "three"
import { canvas } from "../Canvas.js"
import * as Stit from "./StitKeypoint.js";
import * as Roof from "./RoofKeypoint.js";
import * as Valb from "./ValbKeypoint.js";
import { deactivate3dFeedback, activate3dFeedback } from "./Keypoints3dFeedback.js";

var currentOperation;

function startCommand() {
    let [intersect, keypoint] = getClosestIntersect(Valb.valbKeypoints, keypoint => {
        return keypoint.model.children;
    });
    if (intersect != null) {
        currentOperation = keypoint
        currentOperation.startCommand(intersect);
        canvas.addEventListener("pointermove", performCommand);
        canvas.addEventListener("pointerup", finishCommand);
        deactivate3dFeedback()
        return;
    }
     [intersect, keypoint] = getClosestIntersect(Stit.stitKeypoints, keypoint => {
        return [keypoint.model];
    });
    if (intersect != null) {
        currentOperation = keypoint
        currentOperation.startCommand(intersect);
        canvas.addEventListener("pointermove", performCommand);
        canvas.addEventListener("pointerup", finishCommand);
        deactivate3dFeedback()
        return;
    }
    
    [intersect, keypoint] = getClosestIntersect(Roof.roofKeypoints, keypoint => {
        return [keypoint.model];
    });
    if (intersect != null) {
        currentOperation = keypoint
        currentOperation.startCommand(intersect);
        canvas.addEventListener("pointermove", performCommand);
        canvas.addEventListener("pointerup", finishCommand);
        deactivate3dFeedback()

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
    activate3dFeedback();
}



export function activate3dKeypoints() {
    activate3dFeedback()
        canvas.addEventListener("pointerdown", startCommand);
    Stit.stitKeypoints.forEach(keypoint => {
        keypoint.model.visible = true;
    })
    // Valb.valbKeypoints.forEach(keypoint => {
    //     keypoint.model.visible = true;
    // })

}

export function deactivate3dKeypoints() {
    deactivate3dFeedback();
    canvas.removeEventListener("pointerdown", startCommand);
    canvas.removeEventListener("pointerup", finishCommand);
    Stit.stitKeypoints.forEach(keypoint => {
        keypoint.model.visible = false;
    })
    // Valb.valbKeypoints.forEach(keypoint => {
    //     keypoint.model.visible = false;
    // })
}


export function createRoofKeypoints(block) {
    let stitKeypoint = Stit.createKeypointFor(block)
    let roofKeypoint = Roof.createKeypointFor(block)
    //let valbKeypoint = Valb.createKeypointFor(block)
    Stit.stitKeypoints.push(stitKeypoint);
    Roof.roofKeypoints.push(roofKeypoint);
    //Valb.valbKeypoints.push(valbKeypoint);
    let model = new Group();
    model.add(stitKeypoint.model);
    //model.add(valbKeypoint.model);
    return model;
}
