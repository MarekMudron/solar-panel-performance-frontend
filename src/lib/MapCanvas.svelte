<script>
    import { onMount } from "svelte";
    import { setup } from "$lib/three-resources/Canvas.js";
    import MapTextureLoader from "$lib/MapTextureLoader.svelte";

    import { texture, didLocationChange,currentLocation } from "../stores";

    let canv3d;
    let pxToMeter;

    function textureLoaded(e) {
        texture.set({ texture: e.detail, pxToMeter: pxToMeter });
        shouldLoadTexture = false;
        isTextureLoaded = true;
        initThree();
    }

    function initThree() {
        console.log(canv3d);
        setup(canv3d);
        initMapPlane($texture, $texture.width * pxToMeter);
    }

    let shouldLoadTexture = false;
    let isTextureLoaded = false;

    onMount(() => {
        shouldLoadTexture = $texture == null || $didLocationChange;
    });
</script>




{#if shouldLoadTexture}
    <MapTextureLoader
        on:onTextureLoaded={textureLoaded}
        centerCoords={[$currentLocation.lat, $currentLocation.lon]}
        bind:pxToMeter
    ></MapTextureLoader>
{/if}

    <canvas
        id="canvas"
        style="height:calc(100vh - 60px);visibility:visible; width:100%; z-index:0; display:block; background-color:#000000"
        bind:this={canv3d}
    ></canvas>
