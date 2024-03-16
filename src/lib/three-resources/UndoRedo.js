let undoStack = []
let redoStack = []

export function addOp(redo, undo, args) {
	let obj = { undo, redo, args }
	undoStack.push(obj);
}

export function callUndo() {
	var o = undoStack.pop();
	if (o) {
		const { undo, redo, args } = o
		redoStack.push({ undo, redo, args });
		undo(args);
	}
}

export function callRedo() {
	var o = redoStack.pop();
	if (o) {
		var { undo, redo, args } = o
		undoStack.push({ undo, redo, args });
		redo(args);
	}
}