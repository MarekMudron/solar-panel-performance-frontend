<script>
    import MapTextureLoader from "$lib/MapTextureLoader.svelte";
    import Drawer2D from "$lib/Drawer2D.svelte";
    import Drawer3D from "$lib/Drawer3D.svelte";
    import { panelArray } from "../../stores";
    import { currentLocation } from "../../stores";
    import { afterUpdate, onMount } from "svelte";

    let drawer3d;
    let texture;
    let pxToMeter;

</script>
<h1 style="position:absolute">{JSON.stringify($currentLocation)}</h1>

<MapTextureLoader centerCoords={[$currentLocation.lat, $currentLocation.lon]} bind:pxToMeter={pxToMeter} bind:texture={texture} ></MapTextureLoader>
<Drawer3D bind:this={drawer3d} texture={texture} pxToMeter={pxToMeter}/>


