import { activate } from "$lib/three-resources/Drawer2d.js"
import { createPyramid, createShed, createGable, createHip,createFlat } from "./BlockFactory";
import { deactivate2dKeypoints } from "./keypoints-2d/Keypoints2d.js";
import { deactivate3dKeypoints } from "./keypoints-3d/Keypoints3d.js";

export function drawSedlova() {
    activate(createGable);
    deactivate2dKeypoints()
    deactivate3dKeypoints()

}

export function drawIhlanova() {
    activate(createPyramid)
    deactivate2dKeypoints()
    deactivate3dKeypoints()

}

export function drawValbova() {
    activate(createHip)
    deactivate2dKeypoints()
    deactivate3dKeypoints()

}

export function drawPultova() {
    activate(createShed)
    deactivate2dKeypoints()
    deactivate3dKeypoints()
}

export function drawPlocha() {
    activate(createFlat)
    deactivate2dKeypoints()
    deactivate3dKeypoints()
}