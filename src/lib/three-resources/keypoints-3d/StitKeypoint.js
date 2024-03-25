import { SedlovaBlock, ValbovaBlock, PultovaBlock, IhlanovaBlock } from "../Blocks"
import { BoxGeometry, Color, Mesh, MeshBasicMaterial, Sprite, SpriteMaterial, Vector3 } from "three";
import { add, remove } from "../Scene";
import { getPerpendilarPlane, getSphere } from "../polygonFactory";
import { addOp } from "../UndoRedo";
import { getIntersectWithMesh } from "../Raycaster";
import { camera } from "../Canvas";

export var stitKeypoints = [];


class StitKeypoint {
    constructor(block) {
        this.block = block;
        this.model = this.initModel();
        this.block.addEventListener("resize", (requiredSize) => {
            if (this.block instanceof SedlovaBlock) {
                this.model.scale.set(1, 0.3 / requiredSize.y, 0.3 / this.block.heightRoof);
            }
            else if (this.block instanceof IhlanovaBlock) {
                this.model.scale.set(0.5 / requiredSize.x, 0.5 / requiredSize.y, 0.5 / this.block.heightRoof);
            } else if (this.block instanceof ValbovaBlock) {
                this.model.scale.set(1 - (2 * this.block.depthValb / requiredSize.x), 0.3 / requiredSize.y, 0.3 / this.block.heightRoof);
            } else if (this.block instanceof PultovaBlock) {
                this.model.scale.set(0.3 / requiredSize.x, 1, 0.3 / this.block.heightRoof);
            }
        })
        this.block.addEventListener("roofResize", (newHeight) => {
            if (this.block instanceof SedlovaBlock) {
                this.model.scale.setZ(0.3 / newHeight);
            } else if (this.block instanceof IhlanovaBlock) {
                this.model.scale.setZ(0.5 / newHeight);
            } else if (this.block instanceof ValbovaBlock) {
                this.model.scale.setZ(0.3 / newHeight);
            } else if (this.block instanceof PultovaBlock) {
                this.model.scale.setZ(0.3 / newHeight);
            }
        });
        this.block.addEventListener("valbChange", (requiredDepth) => {
            if (this.block instanceof ValbovaBlock) {
                this.model.scale.setX(1 - (2 * requiredDepth / this.block.baseSize.x));
            }
        });
    }

    initModel() {
        if (this.block instanceof SedlovaBlock) {
            const geometry = new BoxGeometry(1, 1, 1);
            const material = new MeshBasicMaterial();
            const cube = new Mesh(geometry, material);
            // cube.renderOrder = 10 || 999;
            // cube.material.depthTest = false;
            // cube.material.depthWrite = false;
            cube.userData.hoverColor = new Color(0x104d70)
            cube.userData.color = new Color(0x00bbd4)
            cube.material.color = new Color(0x00bbd4)
            cube.position.setZ(1)
            cube.visible = false;
            cube.name = "stitKeypoint"
            cube.scale.set(1, 1, 1)
            return cube;
        } else if (this.block instanceof IhlanovaBlock) {
            let sprite = getSphere(new Vector3())
            sprite.name = "stitKeypoint"
            sprite.userData.hoverColor = new Color(0x104d70)
            sprite.userData.color = new Color(0x00bbd4)
            sprite.material.color = new Color(0x00bbd4)
            sprite.position.setZ(1);
            sprite.scale.set(1, 1, 1)
            return sprite
        } else if (this.block instanceof ValbovaBlock) {
            const geometry = new BoxGeometry(1, 1, 1);
            const material = new MeshBasicMaterial();
            const cube = new Mesh(geometry, material);
            // cube.renderOrder = 10 || 999;
            // cube.material.depthTest = false;
            // cube.material.depthWrite = false;
            cube.userData.hoverColor = new Color(0x104d70)
            cube.userData.color = new Color(0x00bbd4)
            cube.material.color = new Color(0x00bbd4)
            cube.position.setZ(1)
            cube.visible = false;
            cube.name = "stitKeypoint"
            cube.scale.set(1, 1, 1)
            return cube;
        }
        else if (this.block instanceof PultovaBlock) {
            const geometry = new BoxGeometry(1, 1, 1);
            const material = new MeshBasicMaterial();
            const cube = new Mesh(geometry, material);
            // cube.renderOrder = 10 || 999;
            // cube.material.depthTest = false;
            // cube.material.depthWrite = false;
            cube.userData.hoverColor = new Color(0x104d70)
            cube.userData.color = new Color(0x00bbd4)
            cube.material.color = new Color(0x00bbd4)
            cube.position.setZ(1)
            cube.position.setX(-1 / 2)
            cube.visible = false;
            cube.name = "stitKeypoint"
            cube.scale.set(1, 1, 1)
            return cube;
        }
    }

    startCommand(intersect) {
        this.startRoofHeight = this.block.heightRoof
        this.plane = getPerpendilarPlane(intersect.point);
        add(this.plane)
        var lookat = camera.position.clone().setComponent(2, intersect.point.z);
        this.plane.lookAt(lookat);
        this.plane.updateMatrixWorld();
    }

    performCommand() {

        var planeIP = getIntersectWithMesh(this.plane);

        var shiftz = planeIP.point.z;
        this.newHeight = shiftz - this.block.baseSize.z
        this.block.setHeightRoof(this.newHeight);
    }

    finishCommand() {
        remove(this.plane);
        addOp((state) => { state[0].setHeightRoof(state[1]) },
            (state) => { state[0].setHeightRoof(state[2]) },
            [this.block, this.newHeight, this.startRoofHeight])
    }
}

export function createKeypointFor(block) {
    let cp = new StitKeypoint(block);
    stitKeypoints.push(cp)
    return cp
}