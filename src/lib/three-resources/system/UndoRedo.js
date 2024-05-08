let undoStack = []
let doStack = []

export function addOp(doAction, undoAction, args) {
	let requestObj = { undoAction, doAction, args }
	undoStack.push(requestObj);
}

export function callUndo() {
	var operation = undoStack.pop();
	if (operation) {
		const { undoAction, doAction, args } = operation
		doStack.push({ undoAction, doAction, args });
		undoAction(args); // call Undo action
	}
}

export function callRedo() {
	var operation = doStack.pop();
	if (operation) {
		const { undoAction, doAction, args } = operation
		undoStack.push({ undoAction, doAction, args });
		doAction(args); // call Do action
	}
}