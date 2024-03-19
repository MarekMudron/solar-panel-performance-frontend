import { Vector3, PlaneGeometry, MeshBasicMaterial, Mesh, DoubleSide, Group, Color } from "three";
import { getMapPlanePosition } from "../Raycaster";
import { addOp } from "../UndoRedo";


export class EdgeKeypoints {
    constructor(block) {
        this.block = block;
        this.model = this.initModel();
        this.block.addEventListener("resize", (requiredSize) => {
            this.model.children[0].scale.set(1/requiredSize.x,1 ,1)
            this.model.children[1].scale.set(1/requiredSize.x ,1,1)
            this.model.children[2].scale.set(1,1 /requiredSize.y,1)
            this.model.children[3].scale.set(1 ,1/requiredSize.y,1)
        })
    }


    initModel() {
        let g = new Group();
        g.name = "edgeKeypoints"
        let geometry = new PlaneGeometry(0.5, 1);
        let material = new MeshBasicMaterial({ visible: true, side: DoubleSide });
        let plane = new Mesh(geometry, material);
        plane.name = "Edge Mesh"
        plane.renderOrder = 11
        plane.material.depthTest = false;
        plane.material.depthWrite = false;
        plane.position.setZ(0);
        plane.position.setX(1 / 2)
        plane.userData.hoverColor = new Color(0x104d70)
        plane.userData.color = new Color(0x00bbd4)
        plane.material.color = new Color(0x00bbd4)
        plane.userData.lineIndex = 0
        plane.updateMatrixWorld()
        g.add(plane);

        geometry = new PlaneGeometry(0.5, 1);
        material = new MeshBasicMaterial({ visible: true, side: DoubleSide });
        plane = new Mesh(geometry, material);
        plane.name = "Edge Mesh"
        plane.renderOrder = 11
        plane.material.depthTest = false;
        plane.material.depthWrite = false;
        plane.userData.hoverColor = new Color(0x104d70)
        plane.userData.color = new Color(0x00bbd4)
        plane.material.color = new Color(0x00bbd4)
        plane.position.setZ(0);
        plane.position.setX(-1 / 2)
        plane.userData.lineIndex = 1
        plane.updateMatrixWorld()
        g.add(plane);

        geometry = new PlaneGeometry(1, 0.5);
        material = new MeshBasicMaterial({ visible: true,  side: DoubleSide });
        plane = new Mesh(geometry, material);
        plane.name = "Edge Mesh"
        plane.renderOrder = 11
        plane.material.depthTest = false;
        plane.userData.hoverColor = new Color(0x104d70)
        plane.userData.color = new Color(0x00bbd4)
        plane.material.color = new Color(0x00bbd4)
        plane.material.depthWrite = false;
        plane.position.setZ(0);
        plane.position.setY(-1 / 2)
        plane.userData.lineIndex = 2
        plane.updateMatrixWorld()
        g.add(plane);

        geometry = new PlaneGeometry(1, 0.5);
        material = new MeshBasicMaterial({ visible: true,  side: DoubleSide });
        plane = new Mesh(geometry, material);
        plane.name = "Edge Mesh"
        plane.renderOrder = 11
        plane.material.depthTest = false;
        plane.material.depthWrite = false;
        plane.userData.hoverColor = new Color(0x104d70)
        plane.userData.color = new Color(0x00bbd4)
        plane.material.color = new Color(0x00bbd4)
        plane.position.setZ(0);
        plane.position.setY(1 / 2)
        plane.updateMatrixWorld()
        plane.userData.lineIndex = 3
        g.add(plane);

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
            this.newSize.x = offset - this.newSize.x;
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
            this.newSize.y = offset - this.newSize.y;
            this.block.setModelSize(this.newSize)
            this.newPos.add(vec.multiplyScalar(0.5));
            this.block.moveHorizontally(this.newPos)
        }
    }

    finishCommand() {
        addOp((state) => { state[0].setModelSize(state[1]); state[0].moveHorizontally(state[2]) },
            (state) => { state[0].setModelSize(state[3]); state[0].moveHorizontally(state[4]) },
            [this.block, this.newSize, this.newPos, this.startHouseSize, this.startHousePos,])
    }
}