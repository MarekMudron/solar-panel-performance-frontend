import { Scene, Color, Fog } from "three";
import { modelsTo3d, modelsTo2d } from "./Site";

export let scene;

export function setup() {
    scene = new Scene({ background: new Color(0x000000) });
    scene.fog = new Fog( 0x000000, 150, 400 );
}

export function update(renderer, camera) {
    renderer.render(scene, camera);
}

export function add(model) {
    scene.add(model);
}

export function remove(model) {
    scene.remove(model);
}


export function display3d() {
    modelsTo3d()
}

export function display2d() {
    modelsTo2d()
}