<script>
    import MapTextureLoader from "$lib/MapTextureLoader.svelte";
    import Drawer2D from "$lib/Drawer2D.svelte";
    import Drawer3D from "$lib/Drawer3D.svelte";
    import { buildingComponents } from "../../stores";
    import { currentLocation } from "../../stores";

    // import {SceneManager} from "$lib/three-resources/SceneManager.js"

    let drawer3d;
    let texture;
    let pxToMeter;

</script>

<MapTextureLoader   centerCoords={$currentLocation} bind:pxToMeter={pxToMeter} bind:texture={texture} ></MapTextureLoader>
<Drawer3D bind:this={drawer3d} texture={texture} pxToMeter={pxToMeter}/>


