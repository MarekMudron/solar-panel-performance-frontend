import { stringsStorage } from "../../../stores"
import { deactivateDeleter } from "./PanelDeleter";

let activeString;
let strings = [];

class String {
    constructor() {
        this.panels = [];
        this.isActive = false;
    }

    addPanels(panels) {
        this.panels.push(panels)
        this.panels.forEach(panelBlock => {
            if (panelBlock)
                panelBlock.forEach(panel => {
                    panel.setHighlighted(this.isActive);
                });
        })
    }

    setActive(toActive) {
        this.isActive = toActive;
        this.panels.forEach(panelBlock => {
            if (panelBlock)
                panelBlock.forEach(panel => {
                    panel.setHighlighted(toActive);
                });
        })
    }
}

export function createNew() {
    if (activeString) {
        activeString.setActive(false)
    }
    let ns = new String();
    activeString = ns;
    activeString.setActive(true)
    strings.push(ns)
    stringsStorage.set(strings)
}


export function setActiveString(string) {
    activeString.setActive(false)
    activeString = string;
    activeString.setActive(true)
    stringsStorage.set(strings)
    deactivateDeleter();
}

export function addPanelBlock(panels) {
    activeString.addPanels(panels);
    stringsStorage.set(strings)
}

export function deactivateStrings() {
    activeString.setActive(false)
    stringsStorage.set(strings)
}

export function deleteString(string) {
    stringsStorage.update(strings => {
        const index = strings.indexOf(string);
        strings.splice(index, 1);
        return strings;
    })
}

export function hasAnyActiveString() {
    return activeString != null;
}