import { canvas } from "$lib/three-resources/Canvas.js"
import { getMapPlanePosition } from "$lib/three-resources/Raycaster.js"
import { add, scene, remove } from "$lib/three-resources/Scene.js"
import { LineBasicMaterial, BufferGeometry, Line, Vector3 } from "three";
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import {addBlock, removeBlock,fadeAll, unfadeAll} from "./Site"
import { activate2dKeypoints } from "./keypoints-2d/Keypoints2d.js";
import { addOp } from "./UndoRedo";
import { deactivateRemover } from "./Remover.js";
import { drawingInProgress } from "../../stores"
import * as THREE from "three"

let blockFactoryFunc;

function createPerpendicularLines(startVec, endVec) {
    // Create vectors for start and end points
    
    
    // Calculate the direction vector of the original line
    let direction = new THREE.Vector3().subVectors(endVec, startVec);
    
    // Calculate the perpendicular vector and scale it to cover the screen
    let scale = 1000; // You might need to adjust this value based on your viewport size
    let perpendicular = new THREE.Vector3(-direction.y, direction.x, 0).normalize().multiplyScalar(scale);
    
    // Define the lines starting from start and end points using the perpendicular vector
    let lineStart = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(startVec.x - perpendicular.x, startVec.y - perpendicular.y, 0),
            new THREE.Vector3(startVec.x + perpendicular.x, startVec.y + perpendicular.y, 0)
        ]),
        new THREE.LineBasicMaterial({color: 0x99a7ff})
    );
    
    let lineEnd = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(endVec.x - perpendicular.x, endVec.y - perpendicular.y, 0),
            new THREE.Vector3(endVec.x + perpendicular.x, endVec.y + perpendicular.y, 0)
        ]),
        new THREE.LineBasicMaterial({color: 0x99a7ff})
    );
    
    // Return the two lines
    return [lineStart, lineEnd];
}


export function activate(blockFactoryFunc_) {
    deactivateRemover()
    blockFactoryFunc = blockFactoryFunc_
    canvas.addEventListener("pointerup", drawLine);
    fadeAll()
}

export function deactivateDrawer2d() {
    canvas.removeEventListener("pointerup", drawLine);
}

function makeLine(start3d, end3d) {
    const material = new LineBasicMaterial({ color: 0x99a7ff});
    const points = [];
    points.push(start3d);
    points.push(end3d);
    const geometry = new BufferGeometry().setFromPoints(points);
    const line = new Line(geometry, material);
    return line;
}

function makeBlock(line) {
    pointBetween = new Vector3();
    pointBetween.lerpVectors(endPoint, startPoint, 0.5);
    let block = blockFactoryFunc(line.userData.length, line.userData.angle)
    return block;
}

let l1;
let l2;
let linetext = document.createElement( 'div' );
linetext.className = 'linetext';
linetext.style.backgroundColor = "white"
let linelabel;

let recttext = document.createElement( 'div' );
recttext.className = 'recttext';
recttext.style.backgroundColor = "white"
let rectlabel;

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
    if(l1 != null && l2 != null) {
        remove(l1);
        remove(l2);
    }
    let startVec = new THREE.Vector3(startPoint.x, startPoint.y, 0);
    let endVec = new THREE.Vector3(endPoint.x, endPoint.y, 0);
    [l1, l2] =  createPerpendicularLines(startVec, endVec);
    add(l1);
    add(l2);
    

    
    linetext.textContent = (startVec.distanceTo(endVec)).toFixed(2);

    remove(linelabel);
    linelabel = new CSS2DObject( linetext );
    linelabel.position.copy(endVec);
    add( linelabel );
}

let currentLine;
let currentBlock;
var startPoint;
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

function blockMove() {
    let currentPoint = getMapPlanePosition();
    let cp = currentPoint.clone();
    let [dist, vec] = pointLineDistance(currentPoint)
    let s = currentBlock.baseSize.clone();
    s.y = dist
    currentBlock.setModelSize(s)
    let pb = pointBetween.clone();
    pb.add(vec.multiplyScalar(0.5));
    currentBlock.moveHorizontally(pb)


    recttext.textContent = (dist).toFixed(2);

    remove(rectlabel);
    rectlabel = new CSS2DObject( recttext );
    cp.z = 0.001;
    rectlabel.position.copy(cp);
    add( rectlabel );
}

function drawRect() {
    linetext.textContent = ""
    remove(linelabel);


    canvas.removeEventListener("pointermove", lineMove)
    currentBlock = makeBlock(currentLine)
    scene.remove(currentLine);
    remove(l1);
    remove(l2);
    addBlock(currentBlock)
    addOp((block) => addBlock(block), (block) => {removeBlock(block)}, currentBlock);
    canvas.addEventListener("pointermove", blockMove)
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
    drawingInProgress.set(true);
}

function finishRect() {
    recttext.textContent = ""
    remove(rectlabel);
    unfadeAll()
    canvas.removeEventListener("pointerup", finishRect);
    canvas.removeEventListener("pointermove", blockMove);
    activate2dKeypoints();
    drawingInProgress.set(false);
}