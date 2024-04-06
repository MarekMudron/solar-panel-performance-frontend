import { canvas } from "../Canvas.js"
import { getClosestIntersect } from "../Raycaster.js"
import * as Roof from "./RoofKeypoint.js"
import * as Stit from "./StitKeypoint.js"

let hoveredStit;
let hoveredRoof;

function enableStit(intersect) {
    hoveredStit = intersect.object;
    intersect.object.material.color = intersect.object.userData.hoverColor;
}

function disableStit() {
    if (hoveredStit != null) {
        hoveredStit.material.color = hoveredStit.userData.color
        hoveredStit = null;
    }
}

function feedbackTop() {
    try {
        let [intersect, keypoint] = getClosestIntersect(Stit.stitKeypoints, keypoint => {
            return [keypoint.model];
        });
        if (hoveredStit != null) {
            if (intersect == null) {
                disableStit();
            }
        } else {
            if (intersect != null) {
                disableRoof()
                enableStit(intersect)
            }
        }
    }catch(exception) {
        return false;
    }
    
    return false;
}

function enableRoof(intersect) {
    hoveredRoof = intersect.object;
    intersect.object.material.color = intersect.object.userData.hoverColor;
}

function disableRoof() {
    if (hoveredRoof != null) {
        hoveredRoof.material.color = hoveredRoof.userData.color
        hoveredRoof = null;
    }
}


function feedbackRoof() {
    let [intersect, keypoint] = getClosestIntersect(Roof.roofKeypoints, keypoint => {
        return [keypoint.model];
    });
    if (hoveredRoof != null) {
        if (intersect == null) {
            disableRoof()
        }
    } else {
        if (intersect != null) {
            disableStit();
            enableRoof(intersect)
        }
    }
    return false;
}



function feedback() {
    feedbackTop();
    if (hoveredStit == null) {
        feedbackRoof();
    }
}

export function activate3dFeedback() {
    addEventListener("pointermove", feedback)

}

export function deactivate3dFeedback() {
    disableRoof();
    disableStit();
    removeEventListener("pointermove", feedback)

}