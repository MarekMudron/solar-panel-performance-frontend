import { MapControls } from "three/addons/controls/MapControls.js";

export let controls

export function setup(camera, canvas) {
    controls = new MapControls(camera, canvas);
    controls.enablePan = false;
    controls.enableRotate = false;
}

export function update() {
    controls.update();
}

