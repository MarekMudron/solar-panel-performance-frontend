import { Vector3, PlaneGeometry, MeshBasicMaterial, Mesh, DoubleSide, Group, Color } from "three";
import { getMapPlanePosition } from "../Raycaster";
import { addOp } from "../UndoRedo";
import { fadeAll, unfadeAll } from "../Site";

export var edgeKeypoints = [];

class EdgeKeypoints {
    constructor(block) {
        this.block = block;
        this.model = this.initModel();
        this.block.addEventListener("resize", (requiredSize) => {
            this.model.children[0].scale.set(1 / requiredSize.x, 1, 1)
            this.model.children[1].scale.set(1 / requiredSize.x, 1, 1)
            this.model.children[2].scale.set(1, 1 / requiredSize.y, 1)
            this.model.children[3].scale.set(1, 1 / requiredSize.y, 1)
        })
    }


    initModel() {
        let g = new Group();
        g.name = "edgeKeypoints"
        let geometry = new PlaneGeometry(0.5, 1);
        let material = new MeshBasicMaterial({ visible: true, side: DoubleSide });
        let plane1 = new Mesh(geometry, material);
        plane1.name = "Edge Mesh 0"
        plane1.renderOrder = 900
        plane1.material.depthTest = false;
        plane1.material.depthWrite = false;
        plane1.position.setZ(0);
        plane1.position.setX(1 / 2)
        plane1.userData.hoverColor = new Color(0x104d70)
        plane1.userData.color = new Color(0x000000)
        plane1.material.color = new Color(0xff0000)
        plane1.userData.lineIndex = 0
        plane1.updateMatrixWorld()
        g.add(plane1);

        let geometry2 = new PlaneGeometry(0.5, 1);
        let material2 = new MeshBasicMaterial({ visible: true, side: DoubleSide });
        let plane2 = new Mesh(geometry2, material2);
        plane2.name = "Edge Mesh 1"
        plane2.renderOrder = 900
        plane2.material.depthTest = false;
        plane2.material.depthWrite = false;
        plane2.userData.hoverColor = new Color(0x104d70)
        plane2.userData.color = new Color(0xffffff)
        plane2.material.color = new Color(0xffffff)//0x00bbd4
        plane2.position.setZ(0);
        plane2.position.setX(-1 / 2)
        plane2.userData.lineIndex = 1
        plane2.updateMatrixWorld()
        g.add(plane2);

        let geometry3 = new PlaneGeometry(1, 0.5);
        let material3 = new MeshBasicMaterial({ visible: true, side: DoubleSide });
        let plane3 = new Mesh(geometry3, material3);
        plane3.name = "Edge Mesh 2"
        plane3.renderOrder = 900
        plane3.material.depthTest = false;
        plane3.userData.hoverColor = new Color(0x104d70)
        plane3.userData.color = new Color(0x444444)
        plane3.material.color = new Color(0x444444)
        plane3.material.depthWrite = false;
        plane3.position.setZ(0);
        plane3.position.setY(-1 / 2)
        plane3.userData.lineIndex = 2
        plane3.updateMatrixWorld()
        g.add(plane3);

        let geometry4 = new PlaneGeometry(1, 0.5);
        let material4 = new MeshBasicMaterial({ visible: true, side: DoubleSide });
        let plane4 = new Mesh(geometry4, material4);
        plane4.name = "Edge Mesh 3"
        plane4.renderOrder = 900
        plane4.material.depthTest = false;
        plane4.material.depthWrite = false;
        plane4.userData.hoverColor = new Color(0x104d70)
        plane4.userData.color = new Color(0xaaaaaa)
        plane4.material.color = new Color(0xaaaaaa)
        plane4.position.setZ(0);
        plane4.position.setY(1 / 2)
        plane4.updateMatrixWorld()
        plane4.userData.lineIndex = 3
        g.add(plane4);

        return g;
    }

    getStartEndInWS(plane, length, dirVec, rotAnalge) {
        let v = new Vector3()
        let wp = plane.getWorldPosition(v);
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
        this.startHouseSize = this.block.baseSize.clone()
        this.startHousePos = this.block.position.clone();
        this.dirVec = new Vector3(
            Math.cos(this.block.azimuth),
            Math.sin(this.block.azimuth),
            0
        );
        this.edgeIndex = intersect.object.userData.lineIndex;
        let planeIntersected = intersect.object
        let sizeAlongAxis;
        let start, end;
        if (this.edgeIndex == 0) {
            sizeAlongAxis = this.block.baseSize.y;
            [start, end] = this.getStartEndInWS(planeIntersected, sizeAlongAxis, this.dirVec, Math.PI / 2)
        } else if (this.edgeIndex == 1) {
            sizeAlongAxis = this.block.baseSize.y;
            [start, end] = this.getStartEndInWS(planeIntersected, sizeAlongAxis, this.dirVec, Math.PI / 2)
        } else if (this.edgeIndex == 2) {
            sizeAlongAxis = this.block.baseSize.x;
            [start, end] = this.getStartEndInWS(planeIntersected, sizeAlongAxis, this.dirVec, 0)
        } else if (this.edgeIndex == 3) {
            sizeAlongAxis = this.block.baseSize.x;
            [start, end] = this.getStartEndInWS(planeIntersected, sizeAlongAxis, this.dirVec, 0)
        }
        this.start = start;
        this.end = end;
        fadeAll()
    }

    performCommand() {
        let currentPoint = getMapPlanePosition();
        let [offset, vec] = this.pointLineDistance(currentPoint, this.start, this.end);
        this.newSize = this.startHouseSize.clone()
        this.newPos = this.startHousePos.clone();
        if (this.edgeIndex == 0) {
            this.newSize.x = offset + this.newSize.x;
            this.block.setModelSize(this.newSize)
            this.newPos.add(vec.multiplyScalar(0.5));
            this.block.moveHorizontally(this.newPos)
        }
        else if (this.edgeIndex == 1) {
            this.newSize.x = this.newSize.x - offset;
            this.block.setModelSize(this.newSize)
            this.newPos.add(vec.multiplyScalar(0.5));
            this.block.moveHorizontally(this.newPos)
        }
        else if (this.edgeIndex == 2) {
            this.newSize.y = offset + this.newSize.y;
            this.block.setModelSize(this.newSize)
            this.newPos.add(vec.multiplyScalar(0.5));
            this.block.moveHorizontally(this.newPos)
        }
        else if (this.edgeIndex == 3) {
            this.newSize.y = this.newSize.y - offset;
            this.block.setModelSize(this.newSize)
            this.newPos.add(vec.multiplyScalar(0.5));
            this.block.moveHorizontally(this.newPos)
        }
    }

    finishCommand() {
        unfadeAll()
        addOp((state) => { state[0].setModelSize(state[1]); state[0].moveHorizontally(state[2]) },
            (state) => { state[0].setModelSize(state[3]); state[0].moveHorizontally(state[4]) },
            [this.block, this.newSize, this.newPos, this.startHouseSize, this.startHousePos,])
        this.edgeIndex = null;
    }
}


export function createKeypointFor(block) {
    let cp = new EdgeKeypoints(block);
    edgeKeypoints.push(cp)
    return cp
}

export function removeEdgeKPFor(block) {
    edgeKeypoints = edgeKeypoints.filter(element => element.block !== block);
}