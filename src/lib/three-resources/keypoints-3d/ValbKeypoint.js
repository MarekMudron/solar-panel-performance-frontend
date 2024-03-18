

// export class ValbKeypoint {
//     constructor(block) {
//         this.block = block;
//         this.model = this.initModel();
//         this.block.addEventListener("resize", (requiredSize) => {
//             this.model.children.forEach(sprite => {
//                 sprite.scale.set(1 / requiredSize.x, 1 / requiredSize.y, 1 / requiredSize.z);
//             })
//             //this.model.scale.set(1-(2*this.block.depthValb / requiredSize.x), 0.3 / requiredSize.y, 0.3 / this.block.heightRoof);
//             this.model.children[0].position.setX(-1 / 2 + (this.block.depthValb / requiredSize.x))
//             this.model.children[1].position.setX(1 / 2 - (this.block.depthValb / requiredSize.x))
//         })
//         this.block.addEventListener("valbChange", (requiredDepth) => {
//             this.model.children[0].position.setX(-1 / 2 + (requiredDepth / this.block.baseSize.x))
//             this.model.children[1].position.setX(1 / 2 - (requiredDepth / this.block.baseSize.x))
//         });
//     }

//     initModel() {
//         let g = new Group();
//         g.userData.isKeyPoints = true;
//         const material = new SpriteMaterial({ color: 0xaabb00 });
//         let sprite = new Sprite(material);
//         sprite.position.set(-1 / 2, 0, 1);
//         g.add(sprite);
//         sprite = new Sprite(material);
//         sprite.position.set(1 / 2, 0, 1);
//         g.add(sprite);
//         g.position.setZ(0);
//         g.name = "roofKeypointsPoints";
//         g.visible = false;
//         return g;
//     }

//     startCommand(intersect) {
//         this.start = new Vector3();
//         this.end = new Vector3();
//         this.model.children[0].getWorldPosition(this.start)
//         this.model.children[1].getWorldPosition(this.end)
//         this.planePositionWorld  = new Vector3();
//         this.planePositionWorld.lerpVectors(this.end, this.start, 0.5);
//         this.plane = getPerpendilarPlane(this.planePositionWorld);
//         add(this.plane)
// 		this.dirVec = new Vector3(Math.cos(this.block.azimuth), Math.sin(this.block.azimuth), 0);
// 		var lookatPos = camera.position.clone();
//         lookatPos.projectOnPlane(this.dirVec);
//         lookatPos.add(this.block.position)
//         this.plane.lookAt(lookatPos);
//         this.startIntersect = new Vector3()
//         intersect.object.getWorldPosition(this.startIntersect)
//         this.startIntersect.sub(this.planePositionWorld)
//         this.shift = this.startIntersect.clone()
//     }

//     performCommand() {
//         var planeIP = getIntersectWithMesh(this.plane);
//         let newIntersect = planeIP.point.clone().sub(this.shift)
//         newIntersect.z = 0;
//     }

//     finishCommand() {
//         remove(this.plane)
//         addOp((state) => state[0].rotateTo(state[1]),
//             (state) => state[0].rotateTo(state[2]),
//             [this.block, this.posunOdZaciatku, this.startAzimuth])
//     }

// }