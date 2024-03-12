import { PerspectiveCamera, WebGLRenderer, Vector3} from "three";
import * as Scene from "$lib/three-resources/Scene.js"
import * as Controls from "$lib/three-resources/Controls.js"

export let camera;
export let canvas;
let renderer

let prevCamPos = new Vector3(0,0,100);

export function moveCameraUp() {
    prevCamPos.copy(camera.position)
    camera.position.set(0,0,100);
}

export function moveCameraToPrevPos() {
    camera.position.set(prevCamPos.x, prevCamPos.y, prevCamPos.z);
}

export function setup(canvas_) {
    canvas = canvas_
    renderer = new WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(
        (window.devicePixelRatio)
            ? window.devicePixelRatio
            : 1);
    renderer.setSize(window.innerWidth, window.innerHeight);


    camera = new PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    camera.position.set(0,0,100)
    camera.lookAt(0, 0, 10);
    camera.up.set(0, 0, 1);
    camera.layers.enableAll();




    Scene.setup()
    Controls.setup(camera, canvas);


    window.addEventListener("resize", onWindowResize)
    update();
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function update() {
    requestAnimationFrame(update);
    Controls.update();
    Scene.update(renderer, camera);
}

