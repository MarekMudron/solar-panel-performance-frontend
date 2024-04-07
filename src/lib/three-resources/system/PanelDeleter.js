import { canvas } from "../Canvas"
import { stringsStorage } from "../../../stores";

function deleteUnderCursor() {
    stringsStorage.subscribe(strings => {
        strings.forEach(string => {
            string.panels.forEach(panelBlock => {
                if (panelBlock)
                    panelBlock.forEach(panel => {
                        let i = getIntersectWithMesh(panel.model);
                        if (i) {
                            panel.destroy()
                            const index = panelBlock.indexOf(panel);
                            panelBlock.splice(index, 1);
                            panelBlock = panelBlock;
                        }
                    });
            });
        });
    })

}

function startDeleter() {
    canvas.addEventListener("pointermove", deleteUnderCursor);
}

function finishDeleter() {
    canvas.removeEventListener("pointermove", deleteUnderCursor);
}

import { getIntersectWithMesh } from "../Raycaster";
import { deactivatePanelAdder } from "./PanelAdder";
import { deactivatePanelFeedback } from "./PanelAdderFeedback";
import { deactivateStrings } from "./Strings";

export function activateDeleter() {
    canvas.addEventListener("pointerdown", startDeleter);
    canvas.addEventListener("pointerup", finishDeleter);
    deactivatePanelAdder()
    deactivatePanelFeedback()
    deactivateStrings()
}

export function deactivateDeleter() {
    canvas.removeEventListener("pointerdown", startDeleter);
    canvas.removeEventListener("pointerup", finishDeleter);

}