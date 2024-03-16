import { activate } from "$lib/three-resources/Drawer2d.js"
import { createIhlanova, createPultova, createSedlova, createValbova } from "./BlockFactory";
import { deactivateKeypoints } from "./Keypoints.js";
import { toggleMode as toggleViewMode } from "./Mode.js";

export function drawSedlova() {
    activate(createSedlova);
    deactivateKeypoints()
}

export function drawIhlanova() {
    activate(createIhlanova)
    deactivateKeypoints()
}

export function drawValbova() {
    activate(createValbova)
    deactivateKeypoints()
}

export function drawPultova() {
    activate(createPultova)
    deactivateKeypoints()
}

export function toggleMode() {
    toggleViewMode();
    
}
