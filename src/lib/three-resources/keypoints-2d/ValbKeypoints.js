import { Sprite, SpriteMaterial, Vector3, Group } from "three";
import { getMapPlanePosition } from "../Raycaster";
import { addOp } from "../UndoRedo";
import { getSphere } from "../polygonFactory";
import { fadeAll, unfadeAll } from "../Site";
import { add } from "../Scene";
export var valbKeypoints = [];

class ValbKeypoint {
    constructor(block) {
        this.block = block;
        this.model = this.initModel();
        this.block.addEventListener("resize", (requiredSize) => {
            this.model.children.forEach(sprite => {
                sprite.scale.set(1 / requiredSize.x, 1 / requiredSize.y, 1 / requiredSize.z);
            })
            this.model.children[0].position.setX(-1 / 2 + (this.block.depthValb / requiredSize.x))
            this.model.children[1].position.setX(1 / 2 - (this.block.depthValb / requiredSize.x))
        })
        this.block.addEventListener("valbChange", (newDepth) => {
            this.model.children[0].position.setX(-1 / 2 + (newDepth / this.block.baseSize.x))
            this.model.children[1].position.setX(1 / 2 - (newDepth / this.block.baseSize.x))

        });
    }

    initModel() {
        let g = new Group();
        g.userData.isKeyPoints = true;
        let s1 = getSphere(new Vector3(-1 / 2, 0, 0))
        g.add(s1)
        s1.name = "s1"
        let s2 = getSphere(new Vector3(1 / 2, 0, 0))
        s2.name = "s2"
        g.add(s2)

        g.position.setZ(0);
        g.name = "cornerKeypoints";
        return g;
    }

    getStartEndInWS(point, length, dirVec, rotAnalge) {
        let v = new Vector3()
        let wp = point.getWorldPosition(v);
        let wholeDirVec = dirVec.clone().multiplyScalar(length);
        wholeDirVec.applyAxisAngle(new Vector3(0, 0, 1), rotAnalge)
        let start = wholeDirVec.clone().multiplyScalar(0.5).add(wp)
        let end = wholeDirVec.clone().multiplyScalar(-0.5).add(wp)
        return [start, end]
    }


    pointLineDistance(point, startPoint, endPoint) {
        let lineVec = endPoint.clone().sub(startPoint);
        let pointVec = point.clone().sub(startPoint);
        let dot = lineVec.clone().dot(pointVec);
        let ls = lineVec.lengthSq();
        let t = dot / ls;
        let p = startPoint.clone().add(lineVec.multiplyScalar(t));
        let dist = p.distanceTo(point);
        // if cursor out then positive, if cursor in then negative
        dist = lineVec.clone().cross(pointVec).z < 0 ? -dist : dist
        return [dist, point.sub(p)]
    }

    startCommand(intersect) {
        this.dirVec = new Vector3(
            Math.cos(this.block.azimuth),
            Math.sin(this.block.azimuth),
            0
        );
        this.pointIntersected = intersect.object
        let sizeAlongAxis = this.block.baseSize.x;
        let [start, end] = this.getStartEndInWS(this.pointIntersected, sizeAlongAxis, this.dirVec, Math.PI / 2)
        this.start = start;
        this.end = end;
        this.startValbDepth = this.block.depthValb;
        fadeAll()

    }

    performCommand() {
        let currentPoint = getMapPlanePosition();
        let [offset, vec] = this.pointLineDistance(currentPoint, this.start, this.end);
        console.log(offset, vec);
        this.newdepth;
        if (this.pointIntersected.name == "s2")
            this.newdepth = this.startValbDepth - offset;
        else
            this.newdepth = this.startValbDepth + offset;
        this.block.setDepthValb(this.newdepth)

    }

    finishCommand() {
        unfadeAll()
        addOp((state) => state[0].rotateTo(state[1]),
            (state) => state[0].rotateTo(state[2]),
            [this.block, this.newdepth, this.startValbDepth])
    }

}

export function createKeypointFor(block) {
    let cp = new ValbKeypoint(block);
    valbKeypoints.push(cp)
    return cp
}

export function removeCornersKPFor(block) {
    valbKeypoints = valbKeypoints.filter(element => element.block !== block);

}