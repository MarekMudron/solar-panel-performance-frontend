
import { canvas } from "../Canvas.js"
import { getIntersectWithOneOf } from "../Raycaster.js"
import * as Corner from "./CornerKeypoints.js"
import * as Edge from "./EdgeKeypoints.js"
import * as Plane from "./PlaneKeypoints.js"


let hoveredcorner;
let hoveredEdge;
let hoveredPlane;

function enableCorners(intersect) {
    hoveredcorner = intersect.object;
    intersect.object.material.color = intersect.object.userData.hoverColor;

}

function disableCorners() {
    if(hoveredcorner != null) {
        hoveredcorner.material.color = hoveredcorner.userData.color
        hoveredcorner = null;    
    }
}

function feedbackCorners() {
    // eslint-disable-next-line no-unused-vars
    let [intersect, _] = getIntersectWithOneOf(Corner.cornerKeypoints, keypoint => {
        return keypoint.model.children;
    });
    if(hoveredcorner != null) {
        if (intersect == null) {
            disableCorners()
        }
    }else {
        if (intersect != null) {
            disableEdges();
            disablePlane();
            enableCorners(intersect)
        }
    }
}

function enableEdges(intersect) {
    hoveredEdge = intersect.object;
    intersect.object.material.color = intersect.object.userData.hoverColor;

}

function disableEdges() {
    if(hoveredEdge != null) {
        hoveredEdge.material.color = hoveredEdge.userData.color
        hoveredEdge = null;    
    }
}


function feedbackEdges() {
    // eslint-disable-next-line no-unused-vars
    let [intersect, _] = getIntersectWithOneOf(Edge.edgeKeypoints, keypoint => {
        return keypoint.model.children;
    });
    if(hoveredEdge != null) {
        
        if (intersect == null) {
            disableEdges()
        }
    }else {
        if (intersect != null) {
            disableCorners()
            disablePlane()
            enableEdges(intersect);
        }
    }
    return false;
}

function enablePlane(intersect) {
    hoveredPlane = intersect.object;
    hoveredPlane.material.visible = true;

}

function disablePlane() {
    if(hoveredPlane != null) {
        hoveredPlane.material.visible = false;
        hoveredPlane = null;    
    }
}

function feedbackPlane() {
    // eslint-disable-next-line no-unused-vars
    let [intersect, _] = getIntersectWithOneOf(Plane.planeKeypoints, keypoint => {
        return [keypoint.model];
    });
    if(hoveredPlane != null) {

        if (intersect == null) {
            disablePlane()
            
        }
    }else {
        if (intersect != null) {
            disableCorners()
            disableEdges()
            enablePlane(intersect)
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

export function activateFeedback() {
    addEventListener("pointermove", feedback)

}

export function deactivateFeedback() {
    disableCorners();
    disableEdges();
    disablePlane();
    removeEventListener("pointermove", feedback)

}