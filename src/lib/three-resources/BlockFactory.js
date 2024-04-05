import { SedlovaBlock, IhlanovaBlock, ValbovaBlock, PultovaBlock, PlochaBlock } from "./Blocks";
import { Vector3 } from "three"


const DEFAULT_BASE_HEIGHT = 7
const DEFAULT_ROOF_HEIGHT = 7
const DEFAULT_VALB_DEPTH = 2

const defaultPosition = () => new Vector3(0,0,0)

export function createSedlova(sideLength, angle) {
    return new SedlovaBlock(defaultPosition(), new Vector3(sideLength, 0, DEFAULT_BASE_HEIGHT), DEFAULT_ROOF_HEIGHT, angle)
}

export function createIhlanova(sideLength, angle) {
    return new IhlanovaBlock(defaultPosition(), new Vector3(sideLength, 0, DEFAULT_BASE_HEIGHT), DEFAULT_ROOF_HEIGHT, angle)
}


export function createValbova(sideLength, angle) {
    return new ValbovaBlock(defaultPosition(), new Vector3(sideLength, 0, DEFAULT_BASE_HEIGHT), DEFAULT_ROOF_HEIGHT, angle, DEFAULT_VALB_DEPTH)
}

export function createPultova(sideLength, angle) {
    return new PultovaBlock(defaultPosition(), new Vector3(sideLength, 0, DEFAULT_BASE_HEIGHT), DEFAULT_ROOF_HEIGHT, angle)
}

export function createPlocha(sideLength, angle) {
    return new PlochaBlock(defaultPosition(), new Vector3(sideLength, 0, DEFAULT_BASE_HEIGHT), angle)
}