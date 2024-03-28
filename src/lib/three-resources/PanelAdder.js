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

function getLastPos(startPoint, endPoint, y) {
    let diffVec = startPoint.clone().sub(endPoint);
    //let numy = Math.floor(Math.abs(diffVec.y / currentPanel.size.y))
    let numy = y
    let num = (numy*currentPanel.size.y)
    let denom = diffVec.y;
    let coef = num/denom;
    //console.log(diffVec.x*coef);
    let lastPos = new Vector3();
    lastPos.lerpVectors(startPoint, endPoint, -coef); 
    return lastPos;
}

function getPanels(block, faceIndex, startPoint, endPoint) {
    const panels = [];
    let diffVec = startPoint.clone().sub(endPoint);
    let numX = Math.floor(Math.abs(diffVec.x / currentPanel.size.x)) + 1
    let numY = Math.floor(Math.abs(diffVec.y / currentPanel.size.y)) + 1
    let lastPos = getLastPos(startPoint, endPoint)
    let currentPos = startPoint.clone()
    for (let i = 0; i < numX; i++) {
        
        for(let j=0; j < numY; j++) {
            let cp = currentPos.clone()
            cp.x -= i * (currentPanel.size.x);
            cp.y += j* (currentPanel.size.y)
            let lastPos = getLastPos(startPoint, endPoint, j)
            cp.z = lastPos.z;
            let pos = fromLocalToWorld(block, cp)
            let panel = currentPanel.clone();
            panel.setPositionTo(pos)
            block.alignPanel(panel, faceIndex)
            panels.push(panel)
        }
        
    }
    // while (current.x < endPoint.x) {
    //     const cellEnd = Math.min(current.x + currentPanel.size[0], endPoint.x);
    //     let c = block.roofGroup.localToWorld(new Vector3(endPoint.x, startPoint.y, startPoint.z));
    //     c.x = cellEnd;
    //     let panel = currentPanel.clone();
    //     panel.setPositionTo(c)
    //     block.alignPanel(panel, faceIndex)
    //     console.log(panel);
    //     panels.push(panel);
    //     current = cellEnd;
    // }
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
            //console.log(startPoint, endPoint, endPoint.clone().sub(startPoint));
            panels = getPanels(block, intersect.faceIndex, startPoint, endPoint);
            panels.forEach(panel => {
                //console.log(panel);
                add(panel.model)
            });

        }

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