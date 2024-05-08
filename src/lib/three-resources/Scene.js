import { Scene, Color, Fog,PointLight } from "three";
import { modelsTo3d, modelsTo2d } from "./Site";

export let scene;

export function setup() {
    scene = new Scene({ background: new Color(0x000000) });
    scene.fog = new Fog( 0x000000, 150, 400 );
    const light = new PointLight( 0xffffff, 1, 100 ,0 );
    light.position.set( 0, 0, 20 );
    scene.add( light );
}

export function update(renderer, labelRenderer, camera) {
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
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