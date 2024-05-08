import { canvas } from "./Canvas";
import { deactivateDrawer2d } from "./Drawer2d";
import { getIntersectWithMesh } from "./Raycaster";
import { blocks, removeBlock } from "./Site";
import { removePlaneKPFor } from "./keypoints-2d/PlaneKeypoints";
import { removeEdgeKPFor } from "./keypoints-2d/EdgeKeypoints";
import { removeCornersKPFor } from "./keypoints-2d/CornerKeypoints";
import { removeRoofKPFor } from "./keypoints-3d/RoofKeypoint";
import { removeStitKPFor } from "./keypoints-3d/StitKeypoint";
import { deleteInProgress } from "../../stores"


function removeKeypointsFor(block) {
    removePlaneKPFor(block);
    removeEdgeKPFor(block);
    removeCornersKPFor(block);
    removeRoofKPFor(block);
    removeStitKPFor(block)
}

function tryRemove() {
    for (let block of blocks) {
        let intersect = getIntersectWithMesh(block.modelGroup)
        if (intersect != null) {
            removeBlock(block);
            removeKeypointsFor(block)
        }
    }
}

export function activateRemover() {
    deactivateDrawer2d()
    canvas.addEventListener("pointerup", tryRemove)
    deleteInProgress.set(true)
}

export function deactivateRemover() {
    canvas.removeEventListener("pointerup", tryRemove)
    deleteInProgress.set(false)
}