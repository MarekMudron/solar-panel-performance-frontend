import { Raycaster, Vector2, Mesh } from "three";
import { camera, canvas } from "$lib/three-resources/Canvas.js"
import { mapPlane } from "$lib/three-resources/MapPlane.js"
import { scene } from "./Scene";
import { map } from "leaflet";
import { blocks } from "./Site";



let raycaster = new Raycaster();
raycaster.params.Line.threshold = 0.01;
raycaster.params.Points.threshold = 0.01;

function getScreenPlanePosition() {
    return new Vector2(
        ( (event.clientX - canvas.offsetLeft) / canvas.clientWidth ) * 2 - 1,
        ( (event.clientY - canvas.offsetTop) / canvas.clientHeight ) * -2 + 1);
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
    var closestIntersect= {intersect:null, keypoint :null};
	var closestDistance;
    for (const keypoint of keypoints) {
        let intersects = raycaster.intersectObjects(fnToGetModel(keypoint));
        if (intersects.length > 0) {
            let intersect = intersects[0]
            if(closestIntersect.intersect != null) {
                if(intersect.distance < closestDistance) {
                    closestDistance = intersect.distance;
                    closestIntersect = {intersect: intersect, keypoint: keypoint};
                }
            }else {
                closestIntersect = {intersect: intersect, keypoint: keypoint};
                closestDistance = intersect.distance;
            }
        }
    }
    return [closestIntersect.intersect, closestIntersect.keypoint]
}


export function getIntersectWithRoofs() {
    raycaster.setFromCamera(getScreenPlanePosition(), camera);
    var closestIntersect= {intersect:null, keypoint :null};
	var closestDistance;
    for (const block of blocks) {
        let intersects = raycaster.intersectObject(block.roofGroup);
        if (intersects.length > 0) {
            let intersect = intersects[0]
            if(closestIntersect.intersect != null) {
                if(intersect.distance < closestDistance) {
                    closestDistance = intersect.distance;
                    closestIntersect = {intersect: intersect, block: block};
                }
            }else {
                closestIntersect = {intersect: intersect, block: block};
                closestDistance = intersect.distance;
            }
        }
    }
    return [closestIntersect.intersect, closestIntersect.block]
}