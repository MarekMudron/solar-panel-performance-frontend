<script>
    import MapTextureLoader from "$lib/MapTextureLoader.svelte";
    import Drawer2D from "$lib/Drawer2D.svelte";
    import Drawer3D from "$lib/Drawer3D.svelte";
    import { currentStage, panelArray } from "../../stores";
    import { currentLocation } from "../../stores";
    import { afterUpdate, onMount } from "svelte";

    let drawer3d;
    let texture;
    let pxToMeter;

    onMount(() => {
        currentStage.set(1)
    });
</script>
<MapTextureLoader centerCoords={[$currentLocation.lat, $currentLocation.lon]} bind:pxToMeter={pxToMeter} bind:texture={texture} ></MapTextureLoader>
<Drawer3D bind:this={drawer3d} texture={texture} pxToMeter={pxToMeter}/>


