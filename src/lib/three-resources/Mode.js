import { controls } from "./Controls";
import { display3d, display2d} from "./Scene";
import { moveCameraUp,moveCameraToPrevPos } from "./Canvas.js"
import { deactivate2dKeypoints,activate2dKeypoints } from "./Keypoints2d.js";
import { activate3dKeypoints, deactivate3dKeypoints } from "./Keypoints3d.js";
let is2d = true;

export function toggleMode() {
    is2d = !is2d;
    if (is2d) {
        controls.enableRotate = false;
        display2d();
        moveCameraUp()
        activate2dKeypoints();
        deactivate3dKeypoints()
    } else {
        controls.enableRotate = true;
        display3d();
        moveCameraToPrevPos()
        deactivate2dKeypoints()
        activate3dKeypoints()
    }

}