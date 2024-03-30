<script>
    import { onMount } from "svelte";
    import { setup } from "$lib/three-resources/Canvas.js";
    import MapTextureLoader from "$lib/MapTextureLoader.svelte";
    import { initMapPlane } from "$lib/three-resources/MapPlane.js";
    import { texture, didLocationChange, currentLocation } from "../stores";
    import { siteStorage } from "../stores";
    import {addBlock} from "$lib/three-resources/Site.js";
    let canv3d;
    let pxToMeter;

    function textureLoaded(e) {
        texture.set({ texture: e.detail, pxToMeter: pxToMeter });
        shouldLoadTexture = false;
        isTextureLoaded = true;
        didLocationChange.set(false);
        initThree();
    }

    function initThree() {
        setup(canv3d);
        initMapPlane(
            $texture.texture,
            $texture.texture.width * $texture.pxToMeter,
        );
    }

    let shouldLoadTexture = false;
    let isTextureLoaded = false;

    function loadSite() {
        if ($siteStorage)
            $siteStorage.forEach((block) => {
                addBlock(block);
            });
    }

    onMount(() => {
        shouldLoadTexture = $didLocationChange;
        if (!shouldLoadTexture) initThree();
        loadSite();
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
