import { activate } from "$lib/three-resources/Drawer2d.js"
import { createIhlanova, createPultova, createSedlova, createValbova } from "./BlockFactory";
import { deactivate2dKeypoints } from "./Keypoints2d.js";
import { deactivate3dKeypoints } from "./Keypoints3d.js";
import { toggleMode as toggleViewMode } from "./Mode.js";

export function drawSedlova() {
    activate(createSedlova);
    deactivate2dKeypoints()
    deactivate3dKeypoints()

}

export function drawIhlanova() {
    activate(createIhlanova)
    deactivate2dKeypoints()
    deactivate3dKeypoints()

}

export function drawValbova() {
    activate(createValbova)
    deactivate2dKeypoints()
    deactivate3dKeypoints()

}

export function drawPultova() {
    activate(createPultova)
    deactivate2dKeypoints()
    deactivate3dKeypoints()
}

export function toggleMode() {
    toggleViewMode();
    
}
