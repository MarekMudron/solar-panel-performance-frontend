import { Vector3, Group, Sprite, SpriteMaterial, Color } from "three";
import { getPerpendilarPlane, getSphere } from "../polygonFactory";
import { remove, add } from "../Scene";
import { addOp } from "../UndoRedo";
import { getIntersectWithMesh } from "../Raycaster";
import { ValbovaBlock } from "../Blocks";
export var valbKeypoints = [];
import { camera } from "../Canvas";

export class ValbKeypoint {
    constructor(block) {
        this.block = block;
        this.model = this.initModel();
        this.block.addEventListener("resize", (requiredSize) => {
            this.model.children.forEach(sprite => {
                sprite.scale.set(1 / requiredSize.x, 1 / requiredSize.y, 1 / requiredSize.z);
            })
            this.model.children[0].scale.set(0.5 / requiredSize.x, 0.5 / requiredSize.y, 0.5 / requiredSize.z);
            this.model.children[1].scale.set(0.5 / requiredSize.x, 0.5 / requiredSize.y, 0.5 / requiredSize.z);

            this.model.children[0].position.setX(-1 / 2 + (this.block.depthValb / requiredSize.x))
            this.model.children[1].position.setX(1 / 2 - (this.block.depthValb / requiredSize.x))
        })
        this.block.addEventListener("roofResize", (newHeight) => {
            if (this.block instanceof ValbovaBlock) {
                this.model.children[0].scale.setZ(0.5 / newHeight);
                this.model.children[1].scale.setZ(0.5 / newHeight);
            }
        });
        this.block.addEventListener("valbChange", (newDepth) => {
            if (this.block instanceof ValbovaBlock) {
                this.model.children[0].position.setX(-1 / 2 + newDepth/this.block.baseSize.x);
                this.model.children[1].position.setX(1 / 2 - newDepth/this.block.baseSize.x);
            }
        });
    }

    createPoint(posx) {
        let sprite = getSphere(new Vector3())
        sprite.userData.hoverColor = new Color(0x104d70)
        sprite.userData.color = new Color(0x00bbd4)
        sprite.material.color = new Color(0x00bbd4)
        sprite.position.set(posx, 0, 1);
        sprite.visible = true;
        return sprite
    }

    initModel() {
        let g = new Group();
        g.userData.isKeyPoints = true;
        g.add(this.createPoint(-1/2))
        g.add(this.createPoint(1/2))
        g.visible = false;
        return g;
    }

    startCommand(intersect) {
        this.start = new Vector3();
        this.end = new Vector3();
        this.model.children[0].getWorldPosition(this.start)
        this.model.children[1].getWorldPosition(this.end)
        this.planePositionWorld = new Vector3();
        this.planePositionWorld.lerpVectors(this.end, this.start, 0.5);

        this.plane = getPerpendilarPlane(this.planePositionWorld);
        this.plane.rotation.set(0, 0, this.block.azimuth);
        add(this.plane)
        this.dirVec = new Vector3(Math.cos(this.block.azimuth), Math.sin(this.block.azimuth), 0);
        var lookatPos = camera.position.clone();
        lookatPos.projectOnPlane(this.dirVec);
        lookatPos.add(this.block.position)
        this.plane.lookAt(lookatPos);

        this.startIntersect = getIntersectWithMesh(this.plane).point;
        this.startIntersect
    }

    performCommand() {
        var planeIP = getIntersectWithMesh(this.plane);
        let newIntersect = planeIP.point.clone().sub(this.startIntersect)
        console.log(planeIP, newIntersect);
        newIntersect.z = 0;
        this.block.setDepthValb(newIntersect.x)
    }

    finishCommand() {
        remove(this.plane)
        addOp((state) => state[0].rotateTo(state[1]),
            (state) => state[0].rotateTo(state[2]),
            [this.block, this.posunOdZaciatku, this.startAzimuth])
    }

}

export function createKeypointFor(block) {
    let cp = new ValbKeypoint(block);
    valbKeypoints.push(cp)
    return cp
}