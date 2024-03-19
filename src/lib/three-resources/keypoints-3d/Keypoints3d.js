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

let hoveredStit;
let hoveredRoof;

function feedbackTop() {
    if (hoveredStit != null) {
        let [intersect, keypoint] = getPlaneKeypointsIntersect(stitKeypoints, keypoint => {
            return [keypoint.model];
        });
        if (intersect == null) {
            hoveredStit.material.color = hoveredStit.userData.color
            hoveredStit = null;
        }
    } else {
        let [intersect, keypoint] = getPlaneKeypointsIntersect(stitKeypoints, keypoint => {
            return [keypoint.model];
        });
        if (intersect != null) {
            hoveredStit = intersect.object;
            intersect.object.material.color = intersect.object.userData.hoverColor;
        }
    }
    return false;
}

function feedbackRoof() {
    if (hoveredRoof != null) {
        let [intersect, keypoint] = getPlaneKeypointsIntersect(roofKeypoints, keypoint => {
            return [keypoint.model];
        });
        if (intersect == null) {
            hoveredRoof.material.color = hoveredRoof.userData.color
            hoveredRoof = null;
        }
    } else {
        let [intersect, keypoint] = getPlaneKeypointsIntersect(roofKeypoints, keypoint => {
            return [keypoint.model];
        });
        if (intersect != null) {
            hoveredRoof = intersect.object;
            intersect.object.material.color = intersect.object.userData.hoverColor;
        }
    }
    return false;
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

function feedback() {
    feedbackTop()
    if (hoveredStit == null)
        feedbackRoof();
}



export function activate3dKeypoints() {
    canvas.addEventListener("pointermove", feedback)
    canvas.addEventListener("pointerdown", startCommand);
    stitKeypoints.forEach(keypoint => {
        keypoint.model.visible = true;
    })

}

export function deactivate3dKeypoints() {
    canvas.removeEventListener("pointermove", feedback)
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
