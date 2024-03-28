import { Matrix4, Vector3 } from "three";
import { currentPanel } from "./Panels";
import { getIntersectWithRoofs } from "./Raycaster";
import { getSphere } from "./polygonFactory";
import { add, remove } from "./Scene";


let startPoint;
let endPoint;


function fromLocalToWorld(block, coords) {
    let scaleVec = block.roofGroup.scale;
    let scaleMatrix = new Matrix4().makeScale(1 / scaleVec.x, 1 / scaleVec.y, 1 / scaleVec.z)
    coords.z -= block.baseSize.z
    let descaled = coords.applyMatrix4(scaleMatrix)
    let local = block.roofGroup.localToWorld(descaled)
    return local;
}

function getLenW(diffFec) {
    return Math.sqrt(diffFec.y * diffFec.y + diffFec.z * diffFec.z)
}

function getLenW2(diffFec) {
    return Math.sqrt(diffFec.x * diffFec.x + diffFec.z * diffFec.z)
}

function getLastPos(startPoint, endPoint, y) {
    let diffVec = startPoint.clone().sub(endPoint);
    let numy = y
    let num = (numy * currentPanel.size.y)
    let denom = getLenW(diffVec);
    let coef = num / denom;
    let lastPos = new Vector3();

    lastPos.lerpVectors(startPoint, endPoint, coef);
    return lastPos;
}


function getLastPos2(startPoint, endPoint, x) {
    let diffVec = startPoint.clone().sub(endPoint);
    let numx = x
    let num = (numx * currentPanel.size.y)
    let denom = getLenW2(diffVec);
    let coef = num / denom;
    let lastPos = new Vector3();

    lastPos.lerpVectors(startPoint, endPoint, coef);
    return lastPos;
}

function getPanels2(block, faceIndex, startPoint, endPoint) {
    const panels = [];
    let diffVec = startPoint.clone().sub(endPoint);
    let numCols = Math.floor(Math.abs(diffVec.x / currentPanel.size.y)) + 1
    let numRows = Math.floor(Math.abs(getLenW(diffVec) / currentPanel.size.x)) + 1
    let currentPos = startPoint.clone()

    for (let j = 0; j < numRows; j++) {
        for (let i = 0; i < numCols; i++) {
            let cp = currentPos.clone()
            if (startPoint.y < endPoint.y)
                cp.y += j * (currentPanel.size.x);
            else
                cp.y -= j * (currentPanel.size.x);
            let lastPos = getLastPos2(startPoint, endPoint, i)
            cp.x = lastPos.x
            cp.z = lastPos.z
            let pos = fromLocalToWorld(block, cp)
            let panel = currentPanel.clone();
            panel.setPositionTo(pos)
            block.alignPanel(panel, faceIndex)
            panels.push(panel)
        }
    }
    return panels;
}



function getPanels(block, faceIndex, startPoint, endPoint) {
    const panels = [];
    let diffVec = startPoint.clone().sub(endPoint);
    let numX = Math.floor(Math.abs(diffVec.x / currentPanel.size.x)) + 1
    let numY = Math.floor(Math.abs(getLenW(diffVec) / currentPanel.size.y)) + 1
    let currentPos = startPoint.clone()
    for (let i = 0; i < numX; i++) {

        for (let j = 0; j < numY; j++) {
            let cp = currentPos.clone()
            if (startPoint.x < endPoint.x)
                cp.x += i * (currentPanel.size.x);
            else
                cp.x -= i * (currentPanel.size.x);
            let lastPos = getLastPos(startPoint, endPoint, j)
            cp.y = lastPos.y
            cp.z = lastPos.z;
            let pos = fromLocalToWorld(block, cp)
            let panel = currentPanel.clone();
            panel.setPositionTo(pos)
            block.alignPanel(panel, faceIndex)
            panels.push(panel)
        }
    }
    return panels;
}



function fromWorldToLocal(block, coords) {
    let scaleVec = block.roofGroup.scale;
    let scaleMatrix = new Matrix4().makeScale(scaleVec.x, scaleVec.y, scaleVec.z)
    let local = block.roofGroup.worldToLocal(coords).applyMatrix4(scaleMatrix);
    local.z += block.baseSize.z
    return local
}

let panels = [];

function drawPanels() {
    let [intersect, block] = getIntersectWithRoofs()

    if (intersect != null) {
        if (block.alignPanel(currentPanel, intersect.faceIndex)) {
            endPoint = fromWorldToLocal(block, intersect.point)
            let diffVec = endPoint.clone().sub(startPoint);
            panels.forEach(panel => {
                remove(panel.model)
            });
            if(block.isSide(intersect.faceIndex)) {
                panels = getPanels2(block, intersect.faceIndex, startPoint, endPoint);

            }else{
                panels = getPanels(block, intersect.faceIndex, startPoint, endPoint);

            }
            panels.forEach(panel => {
                add(panel.model)
            });

        }
    }else{
        //finish
        removeEventListener("pointermove", drawPanels);
    }
}

function startArea() {
    let [intersect, block] = getIntersectWithRoofs()

    if (intersect != null) {
        if (block.alignPanel(currentPanel, intersect.faceIndex)) {
            startPoint = fromWorldToLocal(block, intersect.point.clone())
            addEventListener("pointermove", drawPanels);
        }

    }
}

function finishArea() {
    let [intersect, block] = getIntersectWithRoofs()

    if (intersect != null) {
        if (block.alignPanel(currentPanel, intersect.faceIndex)) {
            endPoint = block.roofGroup.worldToLocal(intersect.point.clone())
            removeEventListener("pointermove", drawPanels);
        }

    }
}

export function activatePanelAdder() {
    addEventListener("pointerdown", startArea);
    addEventListener("pointerup", finishArea)
}