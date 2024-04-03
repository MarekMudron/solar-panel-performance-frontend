import { getIntersectWithOneOf } from "../Raycaster.js"
import { Group, Color } from "three"
import { canvas } from "../Canvas.js"
import { activateFeedback, deactivateFeedback } from "./Keypoints2dFeedback.js";
import * as Corner from "./CornerKeypoints.js"
import * as Edge from "./EdgeKeypoints.js"
import * as Plane from "./PlaneKeypoints.js"



function startCommand() {
    let [intersect, keypoint] = getIntersectWithOneOf(Corner.cornerKeypoints, keypoint => {
        return keypoint.model.children;
    });
    if (intersect != null) {
        currentOperation = keypoint
        currentOperation.startCommand();
        canvas.addEventListener("pointermove", performCommand);
        canvas.addEventListener("pointerup", finishCommand);
        deactivateFeedback();

        return;
    }

    [intersect, keypoint] = getIntersectWithOneOf(Edge.edgeKeypoints, keypoint => {
        return keypoint.model.children;
    });
    if (intersect != null) {
        currentOperation = keypoint
        currentOperation.startCommand(intersect);
        canvas.addEventListener("pointermove", performCommand);
        canvas.addEventListener("pointerup", finishCommand);
        deactivateFeedback();
        return;
    }

    [intersect, keypoint] = getIntersectWithOneOf(Plane.planeKeypoints, keypoint => {
        return [keypoint.model];
    });
    if (intersect != null) {
        currentOperation = keypoint
        currentOperation.startCommand(intersect);
        canvas.addEventListener("pointermove", performCommand);
        canvas.addEventListener("pointerup", finishCommand);
        deactivateFeedback();
    }
    if(keypoint) {
        keypoint.block.fade();
    }
}

function performCommand() {
    currentOperation.performCommand();
}

function finishCommand() {
    currentOperation.finishCommand();
    if(currentOperation) {
        currentOperation.block.unfade();
    }
    currentOperation = null;
    canvas.removeEventListener("pointermove", performCommand);
    canvas.removeEventListener("pointerup", finishCommand);
    activateFeedback()
    
}





export function activate2dKeypoints() {
    activateFeedback();
    canvas.addEventListener("pointerdown", startCommand);
    Corner.cornerKeypoints.forEach(keypoint => {
        keypoint.model.visible = true;
    })
    Edge.edgeKeypoints.forEach(keypoint => {
        keypoint.model.visible = true;
    })

}

export function deactivate2dKeypoints() {
    canvas.removeEventListener("pointerdown", startCommand);
    deactivateFeedback()
    canvas.removeEventListener("pointerup", finishCommand);
    Corner.cornerKeypoints.forEach(keypoint => {
        keypoint.model.visible = false;
    })
    Edge.edgeKeypoints.forEach(keypoint => {
        keypoint.model.visible = false;
    })
}


var currentOperation;

export function serialize2dKeypoints() {
    return {
        planeKeypoints: Plane.planeKeypoints,
        cornerKeypoints: Corner.cornerKeypoints,
        edgeKeypoints: Edge.edgeKeypoints
    }
}



export function createKeypoints(block) {

    let planeKeypoint = Plane.createKeypointFor(block)
    let cornerKeypoint = Corner.createKeypointFor(block)
    let edgeKeypoint = Edge.createKeypointFor(block)
    let g = new Group();
    g.add(planeKeypoint.model);
    g.add(cornerKeypoint.model);
    g.add(edgeKeypoint.model);
    return g;
}
