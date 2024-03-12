import { activate } from "$lib/three-resources/Drawer2d.js"
import { createIhlanova, createPultova, createSedlova, createValbova } from "./BlockFactory";
import { toggleMode as toggleViewMode } from "./Mode.js";

export function drawSedlova() {
    activate(createSedlova);
}

export function drawIhlanova() {
    activate(createIhlanova)
}

export function drawValbova() {
    activate(createValbova)
}

export function drawPultova() {
    activate(createPultova)
}

export function toggleMode() {
    toggleViewMode();
}
