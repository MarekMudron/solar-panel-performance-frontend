<script>
    import { onMount } from "svelte";
    import {
        Scene,
        Color,
        Fog,
        PlaneGeometry,
        Mesh,
        MeshBasicMaterial,
    } from "three";

    export let scene;



    export function initMapPlane(img, dimMeters) {
        const geometry = new PlaneGeometry(dimMeters, dimMeters);
        let mapPlane = new Mesh(geometry, new MeshBasicMaterial({ visible: true }));
        // let texture = new TextureLoader().load(img.src);
        // texture.colorSpace = SRGBColorSpace;
        // mapPlane.material.map = texture;
        mapPlane.material.depthTest = false;
        scene.add(mapPlane);
    }

    onMount(() => {
        scene = new Scene({ background: new Color(0x000000) });
        scene.fog = new Fog(0x000000, 150, 400);
    });
</script>
