import { controls } from "./Controls";
import { display3d, display2d} from "./Scene";
import { moveCameraUp,moveCameraToPrevPos } from "./Canvas.js"
import { deactivateKeypoints,activateKeypoints } from "./Keypoints.js";
let is2d = true;

export function toggleMode() {
    is2d = !is2d;
    if (is2d) {
        controls.enableRotate = false;
        display2d();
        moveCameraUp()
        activateKeypoints();
    } else {
        controls.enableRotate = true;
        display3d();
        moveCameraToPrevPos()
        deactivateKeypoints()
    }

}