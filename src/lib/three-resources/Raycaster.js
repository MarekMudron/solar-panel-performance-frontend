import { Raycaster, Vector2, Mesh } from "three";
import { camera } from "$lib/three-resources/Canvas.js"
import { mapPlane } from "$lib/three-resources/MapPlane.js"
import { scene } from "./Scene";
import { map } from "leaflet";


let raycaster = new Raycaster();
raycaster.params.Line.threshold = 0.01;
raycaster.params.Points.threshold = 0.01;

function getScreenPlanePosition() {
    return new Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        - (event.clientY / window.innerHeight) * 2 + 1);
}

export function getMapPlanePosition() {
    raycaster.setFromCamera(getScreenPlanePosition(), camera);
    const mapIntersects = raycaster.intersectObject(mapPlane);
    if (mapIntersects.length > 0) {
        mapIntersects[0].point.z = 0;
        return mapIntersects[0].point;
    }
}

export function getIntersectWithMesh(mesh) {
    raycaster.setFromCamera(getScreenPlanePosition(), camera);
    let intersects = raycaster.intersectObject(mesh);
    if (intersects.length > 0) {
        return intersects[0]
    }
}


export function getPlaneKeypointsIntersect(keypoints, fnToGetModel) {
    raycaster.setFromCamera(getScreenPlanePosition(), camera);
    for (const keypoint of keypoints) {
        let intersects = raycaster.intersectObjects(fnToGetModel(keypoint));
        if (intersects.length > 0) {
            //intersects[0].point.z = 0;
            return [intersects[0], keypoint]
        }
    }
    return [null, null];
}


