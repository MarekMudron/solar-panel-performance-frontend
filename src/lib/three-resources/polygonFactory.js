import * as THREE from "three";

const baseColor = 0x003049;
const roofColor = 0x780000;

function createLine(a, b) {
	const points = [a, b];
	const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

	const geometry = new THREE.BufferGeometry().setFromPoints(points);
	const line = new THREE.Line(geometry, material);
	return line;
}

function getPerpendilarPlane(center) {
	var geometry = new THREE.PlaneGeometry(300, 300);
	var material = new THREE.MeshBasicMaterial(
		{ color: 0xaaaaaa, visible: false, side: THREE.DoubleSide });
	var plane = new THREE.Mesh(geometry, material);

	// Setting x,y instead of x,z
	plane.position.set(center.x, center.y, center.z);
	return plane;
}

// size is Vector2
function getPanelGeometry(size) {
	var geometry = new THREE.PlaneGeometry(size.x, size.y);
	var material = new THREE.MeshBasicMaterial(
		{ color: 0x5fdeef, visible: true, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: 0.1 });
	var plane = new THREE.Mesh(geometry, material);
	return plane;
}

function getSphere(center, color) {
	const geometry = new THREE.SphereGeometry(1, 32, 16);
	const material = new THREE.MeshBasicMaterial();
	const sphere = new THREE.Mesh(geometry, material);
	// const material = new THREE.SpriteMaterial( {color: color});
	// const sprite = new THREE.Sprite( material );
	sphere.renderOrder = 1000;
	sphere.material.depthTest = false;
	sphere.material.depthWrite = false;
	sphere.position.set(center.x, center.y, center.z)
	sphere.userData.hoverColor = new THREE.Color("red")
	sphere.userData.color = new THREE.Color("white")
	sphere.color = new THREE.Color("white")
	//sprite.position.set();
	return sphere;
}


function getCuboid() {
	const geometry = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
	// generate for each side of the cube a different color
	const position = geometry.attributes.position;
	const colors = [];
	const color = new THREE.Color();
	for (let i = 0; i < position.count; i += 6) {

		color.setHex(baseColor);
		// first face

		colors.push(color.r, color.g, color.b);
		colors.push(color.r, color.g, color.b);
		colors.push(color.r, color.g, color.b);

		// second face

		colors.push(color.r, color.g, color.b);
		colors.push(color.r, color.g, color.b);
		colors.push(color.r, color.g, color.b);

	}

	geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
	const material = new THREE.MeshBasicMaterial({ vertexColors: true });
	const cube = new THREE.Mesh(geometry, material);
	//cube.scale.set(size.x, size.y, size.z);
	//cube.position.set(0,0,size.z/2);
	return cube;
}

function getSedlo() {
	const vertices = new Float32Array([
		-1 / 2, 0, 1,
		1 / 2, 0, 1,
		-1 / 2, -1 / 2, 0,
		1 / 2, -1 / 2, 0,
		1 / 2, 1 / 2, 0,
		-1 / 2, 1 / 2, 0
	]);

	const indices = new Uint32Array([
		2, 3, 0,
		3, 1, 0,
		0, 4, 5,
		0, 1, 4,
		0, 5, 2,
		1, 3, 4
	]);

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
	geometry.setIndex(new THREE.BufferAttribute(indices, 1));
	const material = new THREE.MeshBasicMaterial({ color: roofColor });
	const sedlo = new THREE.Mesh(geometry, material);
	return sedlo;
}

function getValb() {
	const vertices = new Float32Array([
		-1 / 2, 0, 1,
		1 / 2, 0, 1,
		-1 / 2, -1 / 2, 0,
		1 / 2, -1 / 2, 0,
		1 / 2, 1 / 2, 0,
		-1 / 2, 1 / 2, 0
	]);

	const indices = new Uint32Array([
		2, 3, 0,
		3, 1, 0,
		0, 4, 5,
		0, 1, 4,
		0, 5, 2,
		1, 3, 4
	]);

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
	geometry.setIndex(new THREE.BufferAttribute(indices, 1));
	const material = new THREE.MeshBasicMaterial({ color: roofColor });
	const valb = new THREE.Mesh(geometry, material);
	valb.name = "Valb";
	return valb;
}

function getPyramid() {
	const vertices = new Float32Array([
		0, 0, 1,
		-1 / 2, -1 / 2, 0,
		-1 / 2, 1 / 2, 0,
		1 / 2, 1 / 2, 0,
		1 / 2, -1 / 2, 0
	]);

	const indices = new Uint32Array([
		2, 1, 0,
		3, 2, 0,
		4, 3, 0,
		1, 4, 0
	]);

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
	geometry.setIndex(new THREE.BufferAttribute(indices, 1));

	// Create material
	const material = new THREE.MeshBasicMaterial({ color: roofColor });

	// Create pyramid mesh
	const pyramid = new THREE.Mesh(geometry, material);
	return pyramid;
}








function getPult() {
	var vertices = new Float32Array([
		-1 / 2, 1 / 2, 1,
		-1 / 2, -1 / 2, 1,
		-1 / 2, -1 / 2, 0,
		1 / 2, -1 / 2, 0,
		1 / 2, 1 / 2, 0,
		-1 / 2, 1 / 2, 0
	]);

	const indices = new Uint32Array([
		3, 1, 2,
		1, 0, 5,
		1, 5, 2,
		0, 4, 5,
		0, 1, 4,
		1, 3, 4
	]);

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
	geometry.setIndex(new THREE.BufferAttribute(indices, 1));
	const material = new THREE.MeshBasicMaterial({ color: roofColor });
	const pult = new THREE.Mesh(geometry, material);
	return pult;
}

export { getCuboid, getPult, getPyramid, getSedlo, getValb, getPerpendilarPlane, getSphere as getSphere, createLine, getPanelGeometry };