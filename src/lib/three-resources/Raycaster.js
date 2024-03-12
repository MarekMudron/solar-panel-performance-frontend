import { Raycaster, Vector2 } from "three";
import { camera } from "$lib/three-resources/Canvas.js"
import { mapPlane } from "$lib/three-resources/MapPlane.js"


let raycaster = new Raycaster();
raycaster.params.Line.threshold = 0.02;

function getScreenPlanePosition() {
    return new Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        - (event.clientY / window.innerHeight) * 2 + 1);
}

export function getMapPlanePosition() {
    raycaster.setFromCamera(getScreenPlanePosition(), camera);
    const mapIntersects = raycaster.intersectObjects([mapPlane], false);
    if (mapIntersects.length > 0) {
        mapIntersects[0].point.z = 0;
        return mapIntersects[0].point;
    }
}

