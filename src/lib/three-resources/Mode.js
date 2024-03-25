import { controls } from "./Controls";
import { display3d, display2d } from "./Scene";
import { moveCameraUp, moveCameraToPrevPos } from "./Canvas.js"
import { deactivate2dKeypoints, activate2dKeypoints } from "./keypoints-2d/Keypoints2d.js";
import { activate3dKeypoints, deactivate3dKeypoints } from "./keypoints-3d/Keypoints3d.js";

export let is2d = true;

export function toggleMode() {
    if(is2d) {
        setTo3d()
    }else{
        setTo2d();
    }
}

export function setTo2d() {
    is2d = true;
    controls.enableRotate = false;
    display2d();
    moveCameraUp()
    activate2dKeypoints();
    deactivate3dKeypoints()
}

export function setTo3d() {
    is2d = false;
    controls.enableRotate = true;
    display3d();
    moveCameraToPrevPos()
    deactivate2dKeypoints()
    activate3dKeypoints()
}

