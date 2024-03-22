<script>
    import MapTextureLoader from "$lib/MapTextureLoader.svelte";
    import Drawer2D from "$lib/Drawer2D.svelte";
    import Drawer3D from "$lib/Drawer3D.svelte";
    import { currentStage,  isTextureLoaded, panelArray } from "../../stores";
    import { currentLocation } from "../../stores";
    import { afterUpdate, beforeUpdate, onMount } from "svelte";
    import { getCurveLength } from "two.js/src/utils/curves";

    let texture;
    let pxToMeter;

    function textureLoaded(e) {
        texture = e.detail;
        isTextureLoaded.set(true);
    }

    onMount(() => {
        currentStage.set(1)
    });
</script>
{#if $isTextureLoaded}
<Drawer3D texture={texture} pxToMeter={pxToMeter}/>
{:else}
<MapTextureLoader on:onTextureLoaded={textureLoaded} centerCoords={[$currentLocation.lat, $currentLocation.lon]} bind:pxToMeter={pxToMeter} ></MapTextureLoader>
{/if}



