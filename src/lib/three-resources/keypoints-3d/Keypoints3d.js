import { getClosestIntersect } from "../Raycaster.js"
import { Group } from "three"
import { canvas } from "../Canvas.js"
import * as Stit from "./StitKeypoint.js";
import * as Roof from "./RoofKeypoint.js";
import * as Valb from "./ValbKeypoint.js";
import { deactivate3dFeedback, activate3dFeedback } from "./Keypoints3dFeedback.js";

var currentOperation;

function startCommand() {
    let [intersect, keypoint] = getClosestIntersect(Stit.stitKeypoints, keypoint => {
        if (keypoint != null)
            return [keypoint.model];
        else {
            return []
        }
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
    try {
        Stit.stitKeypoints.forEach(keypoint => {
            keypoint.model.visible = true;
        })
    } catch (exception) {
    }

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
    //Roof.roofKeypoints.push(roofKeypoint);
    let model = new Group();
    if (stitKeypoint != null) {
        Stit.stitKeypoints.push(stitKeypoint);
        model.add(stitKeypoint.model);
    }
    return model;
}
