import { controls } from "./Controls";
import { display3d, display2d } from "./Scene";
import { moveCameraUp, moveCameraToPrevPos } from "./Canvas.js"
import { deactivate2dKeypoints, activate2dKeypoints } from "./keypoints-2d/Keypoints2d.js";
import { activate3dKeypoints, deactivate3dKeypoints } from "./keypoints-3d/Keypoints3d.js";
import { writable } from "svelte/store";

export const is2d = writable(true);

export function toggleMode() {

    is2d.update(x => !x)
    is2d.subscribe(value => {
        if (value) {
            // Execute 2D mode related actions
            controls.enableRotate = false;
            display2d();
            moveCameraUp()
            activate2dKeypoints();
            deactivate3dKeypoints()
        } else {
            // Execute 3D mode related actions
            controls.enableRotate = true;
            display3d();
            moveCameraToPrevPos()
            deactivate2dKeypoints()
            activate3dKeypoints()
        }
    });
    // if ($is2d) {
    //     controls.enableRotate = false;
    //     display2d();
    //     moveCameraUp()
    //     activate2dKeypoints();
    //     deactivate3dKeypoints()
    // } else {
    //     controls.enableRotate = true;
    //     display3d();
    //     moveCameraToPrevPos()
    //     deactivate2dKeypoints()
    //     activate3dKeypoints()
    // }
}