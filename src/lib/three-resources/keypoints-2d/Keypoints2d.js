import { getPlaneKeypointsIntersect } from "../Raycaster.js"
import { Group, Color } from "three"
import { canvas } from "../Canvas.js"
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
        canvas.removeEventListener("pointermove", feedback)

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
        canvas.removeEventListener("pointermove", feedback)
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
        canvas.removeEventListener("pointermove", feedback)

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
    canvas.addEventListener("pointermove", feedback)

}

let hoveredcorner;
let hoveredEdge;
let hoveredPlane;

function feedbackCorners() {
    if(hoveredcorner != null) {
        let [intersect, keypoint] = getPlaneKeypointsIntersect(cornerKeypoints, keypoint => {
            return keypoint.model.children;
        });
        if (intersect != null) {
            // hoveredcorner = intersect.object;
            // let hoverColor = intersect.object.userData.hoverColor;
            // let currentColor = intersect.object.color;
            // intersect.object.userData.originalColor = currentColor
            // intersect.object.material.color = hoverColor
        }else{
            hoveredcorner.material.color = hoveredcorner.userData.color
            hoveredcorner = null;
        }
    }else {
        let [intersect, keypoint] = getPlaneKeypointsIntersect(cornerKeypoints, keypoint => {
            return keypoint.model.children;
        });
        if (intersect != null) {
            hoveredcorner = intersect.object;
            intersect.object.material.color = intersect.object.userData.hoverColor;
        }
    }
}

function feedbackEdges() {
    if(hoveredEdge != null) {
        let [intersect, keypoint] = getPlaneKeypointsIntersect(edgeKeypoints, keypoint => {
            return keypoint.model.children;
        });
        if (intersect == null) {
            hoveredEdge.material.color = hoveredEdge.userData.color
            hoveredEdge = null;
        }
    }else {
        let [intersect, keypoint] = getPlaneKeypointsIntersect(edgeKeypoints, keypoint => {
            return keypoint.model.children;
        });
        if (intersect != null) {
            hoveredEdge = intersect.object;
            console.log(hoveredEdge.userData);
            intersect.object.material.color = intersect.object.userData.hoverColor;
        }
    }
    return false;
}

function feedbackPlane() {
    if(hoveredPlane != null) {
        let [intersect, keypoint] = getPlaneKeypointsIntersect(planeKeypoints, keypoint => {
            return [keypoint.model];
        });
        if (intersect == null) {
            hoveredPlane.material.visible = false;
            hoveredPlane = null;
        }
    }else {
        let [intersect, keypoint] = getPlaneKeypointsIntersect(planeKeypoints, keypoint => {
            return [keypoint.model];
        });
        if (intersect != null) {
            
            hoveredPlane = intersect.object;
            hoveredPlane.material.visible = true;
        }
    }
    return false;
}


function feedback() {
    feedbackCorners();
    if(hoveredcorner == null) {
        feedbackEdges();
        if(hoveredEdge == null) {
            feedbackPlane()
        }
    }
    
    
    
    
    

}




export function activate2dKeypoints() {
    canvas.addEventListener("pointermove", feedback)
    canvas.addEventListener("pointerdown", startCommand);
    cornerKeypoints.forEach(keypoint => {
        keypoint.model.visible = true;
    })
    edgeKeypoints.forEach(keypoint => {
        keypoint.model.visible = true;
    })

}

export function deactivate2dKeypoints() {
    canvas.removeEventListener("pointerdown", startCommand);
    canvas.removeEventListener("pointermove", feedback)
    canvas.removeEventListener("pointerup", finishCommand);
    cornerKeypoints.forEach(keypoint => {
        keypoint.model.visible = false;
    })
    edgeKeypoints.forEach(keypoint => {
        keypoint.model.visible = false;
    })
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
