import { Sprite, SpriteMaterial, Vector3, Group } from "three";
import { getMapPlanePosition } from "../Raycaster";
import { addOp } from "../UndoRedo";
import { getSphere } from "../polygonFactory";


export class CornerKeypoints {
    constructor(block) {
        this.block = block;
        this.model = this.initModel();
        this.block.addEventListener("resize", (requiredSize) => {
            this.model.children.forEach(sprite => {
                sprite.scale.set(1 / requiredSize.x, 1 / requiredSize.y, 1 / requiredSize.z);
            })
        })
    }

    initModel() {
        let g = new Group();
        g.userData.isKeyPoints = true;
        g.add(getSphere(new Vector3(-1 / 2, 1 / 2, 0)))
        g.add(getSphere(new Vector3(1 / 2, 1 / 2, 0)))
        g.add(getSphere(new Vector3(1 / 2, -1 / 2, 0)))
        g.add(getSphere(new Vector3(-1 / 2, -1 / 2, 0)))
        

        g.position.setZ(0);
        g.name = "cornerKeypoints";
        return g;
    }

    startCommand() {
        this.startAzimuth = this.block.azimuth;
        var currentPos = getMapPlanePosition();
        var vecA = currentPos.sub(this.block.position).normalize();
        var vecB = new Vector3(Math.cos(this.block.azimuth), Math.sin(this.block.azimuth), 0);
        let catchAngle = vecA.angleTo(vecB);
        var crossProduct = new Vector3();
        crossProduct.crossVectors(vecB, vecA);
        var sign = Math.sign(crossProduct.z);
        if (sign < 0) {
            catchAngle = 2 * Math.PI - catchAngle;
        }
        this.startAngle = catchAngle;
    }

    performCommand() {
        var newPos = getMapPlanePosition();
        var vecA = newPos.sub(this.block.position).normalize();
        var vecB = new Vector3(Math.cos(this.startAngle), Math.sin(this.startAngle), 0);
        this.posunOdZaciatku = vecA.angleTo(vecB);

        var crossProduct = new Vector3();
        crossProduct.crossVectors(vecB, vecA);
        var sign = Math.sign(crossProduct.z);
        if (sign < 0) {
            this.posunOdZaciatku = 2 * Math.PI - this.posunOdZaciatku;
        }
        this.block.rotateTo(this.posunOdZaciatku);
    }

    finishCommand() {
        addOp((state) => state[0].rotateTo(state[1]),
            (state) => state[0].rotateTo(state[2]),
            [this.block, this.posunOdZaciatku, this.startAzimuth])
    }

}