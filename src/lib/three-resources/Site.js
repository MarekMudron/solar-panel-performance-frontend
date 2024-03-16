import {add, remove} from "./Scene"
let blocks = []

export function addBlock(block) {
	blocks.push(block);
add(block.modelGroup)
}


export function removeBlock(block) {
	blocks = blocks.filter(item => item !== block);
	remove(block.modelGroup)
}

export function modelsTo3d() {
	blocks.forEach(block => {
		block.as3d();
	});
}

export function modelsTo2d() {
	blocks.forEach(block => {
		block.as2d();
	});
}