import { PlaneGeometry, Mesh, MeshBasicMaterial, SRGBColorSpace,TextureLoader } from "three";
import { add } from "$lib/three-resources/Scene.js"

export let mapPlane;

export function initMapPlane(img, dimMeters) {
    const geometry = new PlaneGeometry(dimMeters, dimMeters);
    mapPlane = new Mesh(geometry, new MeshBasicMaterial({ visible: true }));
    let texture = new TextureLoader().load(img.src);
    texture.colorSpace = SRGBColorSpace;
    mapPlane.material.map = texture
    mapPlane.material.depthTest = false;
    add(mapPlane)
}
