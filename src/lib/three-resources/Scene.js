import { Scene, Color } from "three";
import { modelsTo3d, modelsTo2d } from "./Site";

export let scene;

export function setup() {
    scene = new Scene({ background: new Color(0xf4f4f0) });
}

export function update(renderer, camera) {
    renderer.render(scene, camera);
}

export function add(model) {
    scene.add(model);
}

export function display3d() {
    modelsTo3d()
}

export function display2d() {
    modelsTo2d()
}