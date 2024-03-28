import { add, remove } from "./Scene"
export let panels = []

export function addPanel(block) {
	blocks.push(block);
	add(block.modelGroup)
}


export function removePanel(block) {
	blocks = blocks.filter(item => item !== block);
	remove(block.modelGroup)
}