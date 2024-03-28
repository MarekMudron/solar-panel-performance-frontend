import { currentPanel } from "./Panels";
import { getIntersectWithRoofs, getMapPlanePosition } from "./Raycaster";

function performFeedback() {
    let [intersect, block] = getIntersectWithRoofs()

    if (intersect != null) {
        if (block.alignPanel(currentPanel, intersect.faceIndex)) {
            currentPanel.model.visible = true;
            currentPanel.setPositionTo(intersect.point)
        }else{
            currentPanel.model.visible = false;
        }
    } else {
        currentPanel.model.visible = false;
    }
}

export function activatePanelFeedback() {
    addEventListener("pointermove", performFeedback);
}