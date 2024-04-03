import * as THREE from "three"
import { MathUtils } from "three";
import * as polygonFactory from "./polygonFactory.js";
import { createKeypoints } from "./keypoints-2d/Keypoints2d.js";
import { createRoofKeypoints } from "./keypoints-3d/Keypoints3d.js";


const baseColor = 0x003049;
const roofColor = 0x780000;
const roofHoverColor = 0xc1121f;
const baseHoverColor = 0x669bbc;

function changeValb(valbModel, pos) {
    var roof = valbModel.children[0];
    var wireframe = valbModel.children[1];
    var roofposAttr = roof.geometry.attributes.position;
    var wireframeposAttr = wireframe.geometry.attributes.position;
    // eslint-disable-next-line no-constant-condition
    if (true) { //left
        let p = 0.5 - pos
        var rooflefpointindex = 0;
        roofposAttr.setX(rooflefpointindex, -p);
        wireframeposAttr.setX(0, -p);
        wireframeposAttr.setX(2, -p);
        wireframeposAttr.setX(5, -p);
    }
    // eslint-disable-next-line no-constant-condition
    if (true) {//reight
        let p = -pos + 0.5
        var roofrightpointindex = 1;
        roofposAttr.setX(roofrightpointindex, p);
        wireframeposAttr.setX(1, p);
        wireframeposAttr.setX(6, p);
        wireframeposAttr.setX(9, p);

    }
    roofposAttr.needsUpdate = true;
    wireframeposAttr.needsUpdate = true;
}

function setOpacity(obj, opacity) {
    if (obj instanceof THREE.Mesh) {
        obj.material.opacity = opacity
        obj.material.transparent = true;
        obj.needsUpdate = true;
    } else if (obj instanceof THREE.Group) {
        obj.traverse(child => {
            if (child !== obj)
                setOpacity(child, opacity)
        })
    }
}

class RoofBlock {

    constructor(pos2d, baseSize, heightRoof, azimuth) {
        if (this.constructor === RoofBlock) {
            throw new Error("Cannot instantiate abstract class");
        }
        this.listeners = new Map();
        this.baseSize = baseSize;			// Vec3
        this.azimuth = azimuth;				// float
        this.heightRoof = heightRoof;		// float
        this.position = pos2d; 				// Vec2
        this.baseGroup = this.initBase2d();	// Group consisting of wireframe and filling
        this.modelGroup = new THREE.Group();
        this.modelGroup.add(this.baseGroup);
        this.keyPointsGroup = createKeypoints(this);
        this.modelGroup.add(this.keyPointsGroup);
        this.as2d()
        this.moveHorizontally(pos2d);
    }

    fade() {
        // base completely opaque
        this.baseGroup.visible = false;
        setOpacity(this.roofGroup, 0.5)
        this.keyPointsGroup.visible = false
        // roof partially opaque
        // this.roofGroup.traverse(mesh => {
        //     if (mesh instanceof THREE.Mesh) {
        //         mesh.material.opacity = 0.5
        //         mesh.needsUpdate = true;
        //     }
        //     else if (mesh instanceof THREE.Group) {
        //         this.roofGroup.traverse(mesh => {
        //             if (mesh instanceof THREE.Mesh) {
        //                 mesh.material.opacity = 0.5
        //                 mesh.needsUpdate = true;
        //             }

        //         })
        //     }
        // })
        // keypoints partially opaque
    }

    unfade() {
        this.baseGroup.visible = true;
        setOpacity(this.roofGroup, 1)
        this.keyPointsGroup.visible = true
    }

    addEventListener(event, callback) {
        if (!(this.listeners.has(event))) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    emitEvent(event, ...args) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach(callback => {
                callback(...args);
            });
        }
    }

    initBase2d() {
        let g = new THREE.Group();
        const baseFilling = polygonFactory.getCuboid(this.baseSize);
        g.add(baseFilling);
        var wgeo = new THREE.EdgesGeometry(baseFilling.geometry);
        var wmat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true });
        var wireframe = new THREE.LineSegments(wgeo, wmat);
        g.add(wireframe);
        g.userData.isBase = true;
        g.userData.isRoof = false;
        g.userData.hoverColor = new THREE.Color(baseHoverColor);
        g.userData.mainColor = new THREE.Color(baseColor);
        g.position.setZ(this.baseSize.z / 2);
        g.scale.set(this.baseSize.x, this.baseSize.y, this.baseSize.z);
        return g;
    }


    as2d() {
        this.modelGroup.scale.set(1, 1, 0.000000001)
    }

    as3d() {
        this.modelGroup.scale.set(1, 1, 1)
    }

    setModelSize(requiredSize) {
        this.baseSize = requiredSize;
        this.modelGroup.children.forEach(group => {
            if (group.userData.isBase) {
                group.scale.set(requiredSize.x, requiredSize.y, requiredSize.z);
                return;
            }
            if (group.userData.isRoof) {
                group.scale.set(requiredSize.x, requiredSize.y, group.scale.z);
                return;
            }
            this.keyPointsGroup.scale.set(requiredSize.x, requiredSize.y, requiredSize.z)
        });
        this.emitEvent("resize", requiredSize)
    }

    rotateTo(requiredAzimuth) {
        this.azimuth = requiredAzimuth;
        //this.modelGroup.rotation.set(0,0,requiredAzimuth);
        this.modelGroup.children.forEach((elem) => {
            elem.rotation.set(0, 0, requiredAzimuth);
        });
    }

    moveHorizontally(newPosition) {
        this.position.set(newPosition.x, newPosition.y);
        this.modelGroup.position.setX(newPosition.x);
        this.modelGroup.position.setY(newPosition.y);
        this.modelGroup.updateMatrixWorld();
    }

    setHeightRoof(requiredHeight) {
        this.heightRoof = requiredHeight;
        this.roofGroup.scale.setZ(requiredHeight);
        this.emitEvent("roofResize", requiredHeight)
    }

    setBaseHeight(requiredHeight) {
        this.baseSize.z = requiredHeight;
        this.modelGroup.children.forEach(group => {
            if (group.userData.isBase) {
                group.scale.setZ(requiredHeight);
                group.position.setZ(requiredHeight / 2);
            }
            if (group.userData.isRoof) {
                group.position.setZ(requiredHeight);
            }
        });
    }




}
// eslint-disable-next-line no-unused-vars
function getAngleDeg(heightRoof, houseSizeY) {
    return MathUtils.radToDeg(Math.atan(heightRoof / houseSizeY));
}

export class SedlovaBlock extends RoofBlock {
    constructor(position, size, heightRoof, azimuth) {
        super(position, size, heightRoof, azimuth);
        this.roofGroup = this.initRoof();	// Group consisting of wireframe and filling
        this.modelGroup.add(this.roofGroup);
        this.rotateTo(azimuth)
        this.roofKeyPointsGroup = createRoofKeypoints(this);
        this.roofGroup.add(this.roofKeyPointsGroup);
    }

    initRoof() {
        let g = new THREE.Group();
        const roofFilling = polygonFactory.getSedlo();
        g.add(roofFilling);
        var wgeo = new THREE.EdgesGeometry(roofFilling.geometry);
        var wmat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true });
        var wireframe = new THREE.LineSegments(wgeo, wmat);
        g.add(wireframe);
        g.userData.isRoof = true;
        g.userData.isBase = false;
        g.userData.hoverColor = roofHoverColor;
        g.userData.mainColor = roofColor;

        g.position.setZ(this.baseSize.z);
        g.scale.set(this.baseSize.x, this.baseSize.y, this.heightRoof);
        return g;
    }

    alignPanel(panel, intersectFaceIndex) {
        if (![0, 1, 2, 3].includes(intersectFaceIndex)) {
            return false;
        }
        var euler;
        if ([0, 1].includes(intersectFaceIndex)) {
            euler = new THREE.Euler(MathUtils.degToRad(getAngleDeg(this.heightRoof, this.baseSize.y / 2)), 0, 0, "ZXY");
        } else if ([2, 3].includes(intersectFaceIndex)) {
            euler = new THREE.Euler(MathUtils.degToRad(-getAngleDeg(this.heightRoof, this.baseSize.y / 2)), 0, 0, "ZXY");
        }
        euler.z = this.azimuth;
        panel.euler = euler;
        panel.model.setRotationFromEuler(euler);
        return true;
    }

    isSide(faceIndex) {
        return false;
    }
}


export class IhlanovaBlock extends RoofBlock {
    constructor(position, size, heightRoof, azimuth) {
        super(position, size, heightRoof, azimuth);
        this.roofGroup = this.initRoof();	// Group consisting of wireframe and filling
        this.modelGroup.add(this.roofGroup);
        this.rotateTo(azimuth)
        this.roofKeyPointsGroup = createRoofKeypoints(this);
        this.roofGroup.add(this.roofKeyPointsGroup);
    }

    initRoof() {
        let g = new THREE.Group();
        const pyramidFilling = polygonFactory.getPyramid();
        g.add(pyramidFilling);
        var geo = new THREE.EdgesGeometry(pyramidFilling.geometry);
        var mat = new THREE.LineBasicMaterial({ color: 0x000000 });
        var wireframe = new THREE.LineSegments(geo, mat);
        g.add(wireframe);
        g.userData.isRoof = true;
        g.userData.isBase = false;
        g.userData.hoverColor = roofHoverColor;
        g.userData.mainColor = roofColor;
        g.position.setZ(this.baseSize.z);
        g.scale.set(this.baseSize.x, this.baseSize.y, this.heightRoof);
        return g;
    }

    alignPanel(panel, intersectFaceIndex) {
        if (![0, 1, 2, 3].includes(intersectFaceIndex)) {
            return false;
        }
        var euler;
        if (intersectFaceIndex == 3) {
            euler = new THREE.Euler(MathUtils.degToRad(getAngleDeg(this.heightRoof, this.baseSize.y / 2)), 0, this.azimuth, "ZXY");
        } else if (intersectFaceIndex == 1) {
            euler = new THREE.Euler(MathUtils.degToRad(-getAngleDeg(this.heightRoof, this.baseSize.y / 2)), 0, this.azimuth, "ZXY");
        } else if (intersectFaceIndex == 2) {
            euler = new THREE.Euler(MathUtils.degToRad(getAngleDeg(this.heightRoof, this.baseSize.x / 2)), 0, this.azimuth + Math.PI / 2, "ZXY");
        } else if (intersectFaceIndex == 0) {
            euler = new THREE.Euler(MathUtils.degToRad(-getAngleDeg(this.heightRoof, this.baseSize.x / 2)), 0, this.azimuth + Math.PI / 2, "ZXY");
        }
        panel.euler = euler;
        panel.model.setRotationFromEuler(euler);
        return true;
    }

    isSide(faceIndex) {
        return faceIndex == 2 || faceIndex == 0;
    }
}


export class ValbovaBlock extends RoofBlock {
    constructor(position, size, heightRoof, azimuth, depthValb) {
        super(position, size, heightRoof, azimuth);
        this.depthValb = depthValb
        this.roofGroup = this.initRoof();	// Group consisting of wireframe and filling
        this.modelGroup.add(this.roofGroup);

        this.setDepthValb(depthValb);
        this.rotateTo(azimuth)
        this.roofKeyPointsGroup = createRoofKeypoints(this);
        this.roofGroup.add(this.roofKeyPointsGroup);
    }

    setDepthValb(requiredDepth) {
        this.depthValb = requiredDepth;
        changeValb(this.roofGroup, requiredDepth / this.baseSize.x);
        this.emitEvent("valbChange", requiredDepth)

    }

    initRoof() {
        let g = new THREE.Group();
        const roofFilling = polygonFactory.getValb();
        g.add(roofFilling);
        var wgeo = new THREE.EdgesGeometry(roofFilling.geometry);
        var wmat = new THREE.LineBasicMaterial({ color: 0x000000 });
        var wireframe = new THREE.LineSegments(wgeo, wmat);
        g.add(wireframe);
        g.userData.isRoof = true;
        g.userData.isBase = false;
        g.userData.hoverColor = roofHoverColor;
        g.userData.mainColor = roofColor;
        g.position.setZ(this.baseSize.z);
        g.scale.set(this.baseSize.x, this.baseSize.y, this.heightRoof);

        return g;
    }


}

export class PultovaBlock extends RoofBlock {
    constructor(position, size, heightRoof, azimuth) {
        super(position, size, heightRoof, azimuth);
        this.roofGroup = this.initRoof();	// Group consisting of wireframe and filling
        this.modelGroup.add(this.roofGroup);
        this.rotateTo(azimuth)
        this.roofKeyPointsGroup = createRoofKeypoints(this);
        this.roofGroup.add(this.roofKeyPointsGroup);
    }

    initRoof() {
        let g = new THREE.Group();
        const pultFilling = polygonFactory.getPult();
        g.add(pultFilling);
        var geo = new THREE.EdgesGeometry(pultFilling.geometry);
        var mat = new THREE.LineBasicMaterial({ color: 0x000000 });
        var wireframe = new THREE.LineSegments(geo, mat);
        wireframe.name = "linesegments"
        g.add(wireframe);
        g.userData.isRoof = true;
        g.userData.isBase = false;
        g.userData.hoverColor = roofHoverColor;
        g.userData.mainColor = roofColor;
        g.position.setZ(this.baseSize.z);
        g.scale.set(this.baseSize.x, this.baseSize.y, this.heightRoof);
        return g;
    }

}
