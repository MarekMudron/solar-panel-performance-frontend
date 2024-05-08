import { GableBlock, PyramidBlock, HipBlock, ShedBlock, FlatBlock } from "./Blocks";
import { Vector3 } from "three"


const DEFAULT_BASE_HEIGHT = 7
const DEFAULT_ROOF_HEIGHT = 7
const DEFAULT_VALB_DEPTH = 2

const defaultPosition = () => new Vector3(0,0,0)

export function createGable(sideLength, angle) {
    return new GableBlock(defaultPosition(), new Vector3(sideLength, 0, DEFAULT_BASE_HEIGHT), DEFAULT_ROOF_HEIGHT, angle)
}

export function createPyramid(sideLength, angle) {
    return new PyramidBlock(defaultPosition(), new Vector3(sideLength, 0, DEFAULT_BASE_HEIGHT), DEFAULT_ROOF_HEIGHT, angle)
}

export function createHip(sideLength, angle) {
    return new HipBlock(defaultPosition(), new Vector3(sideLength, 0, DEFAULT_BASE_HEIGHT), DEFAULT_ROOF_HEIGHT, angle, DEFAULT_VALB_DEPTH)
}

export function createShed(sideLength, angle) {
    return new ShedBlock(defaultPosition(), new Vector3(sideLength, 0, DEFAULT_BASE_HEIGHT), DEFAULT_ROOF_HEIGHT, angle)
}

export function createFlat(sideLength, angle) {
    return new FlatBlock(defaultPosition(), new Vector3(sideLength, 0, DEFAULT_BASE_HEIGHT), angle)
}