import { canvas } from "$lib/three-resources/Canvas.js"
import { getMapPlanePosition } from "$lib/three-resources/Raycaster.js"
import { add, scene } from "$lib/three-resources/Scene.js"
import { LineBasicMaterial, BufferGeometry, Line, Vector3 } from "three";
import {addBlock} from "./Site"
let blockFactoryFunc;

export function activate(blockFactoryFunc_) {
    blockFactoryFunc = blockFactoryFunc_
    canvas.addEventListener("pointerup", drawLine);
}

function makeLine(start3d, end3d) {
    const material = new LineBasicMaterial({ color: 0x0000ff });
    const points = [];
    points.push(start3d);
    points.push(end3d);
    const geometry = new BufferGeometry().setFromPoints(points);
    const line = new Line(geometry, material);
    return line;
}

function makePlane(line) {
    pointBetween = new Vector3();
    pointBetween.lerpVectors(endPoint, startPoint, 0.5);
    let block = blockFactoryFunc(line.userData.length, line.userData.angle)
    return block;
}


function updateEndPointAndLen(line, endPos) {
    const positionAttribute = line.geometry.getAttribute('position');
    positionAttribute.setXYZ(1, endPos.x, endPos.y, endPos.z);
    positionAttribute.needsUpdate = true;
    endPoint = endPos;
    line.userData.length = startPoint.distanceTo(endPos);
    let angle;
    if (endPoint.x !== startPoint.x) {
        angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    } else {
        // For vertical lines, set the angle to 90 degrees (in radians)
        angle = Math.PI / 2;
    }
    line.userData.angle = angle;
}

let currentLine;
let currentPlane;
let startPoint;
let endPoint;
let pointBetween;

function lineMove() {
    let pos = getMapPlanePosition();
    updateEndPointAndLen(currentLine, pos)
}

function pointLineDistance(point) {
    let lineVec = endPoint.clone().sub(startPoint);
    let pointVec = point.clone().sub(startPoint);
    let dot = lineVec.clone().dot(pointVec);
    let ls = lineVec.lengthSq();
    let t = dot / ls;
    let p = startPoint.clone().add(lineVec.multiplyScalar(t));
    return [p.distanceTo(point), point.sub(p)]
}

function rectMove() {
    let currentPoint = getMapPlanePosition();
    let [dist, vec] = pointLineDistance(currentPoint)
    let s = currentPlane.baseSize.clone();
    s.y = dist
    currentPlane.setModelSize(s)
    let pb = pointBetween.clone();
    pb.add(vec.multiplyScalar(0.5));
    currentPlane.moveHorizontally(pb)
}

function drawRect() {
    canvas.removeEventListener("pointermove", lineMove)
    currentPlane = makePlane(currentLine)
    scene.remove(currentLine);

    addBlock(currentPlane)
    canvas.addEventListener("pointermove", rectMove)
    canvas.addEventListener("pointerup", finishRect);
    canvas.removeEventListener("pointerup", drawRect);
}

function drawLine() {
    startPoint = getMapPlanePosition();
    currentLine = makeLine(startPoint, startPoint.clone())
    canvas.addEventListener("pointermove", lineMove);
    add(currentLine);
    canvas.addEventListener("pointerup", drawRect);
    canvas.removeEventListener("pointerup", drawLine)
}

function finishRect() {
    
    canvas.removeEventListener("pointerup", finishRect);
    canvas.removeEventListener("pointermove", rectMove);
}