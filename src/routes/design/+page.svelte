<script>
    import MapTextureLoader from "$lib/MapTextureLoader.svelte";
    import Drawer2D from "$lib/Drawer2D.svelte";
    import Drawer3D from "$lib/Drawer3D.svelte";
    import { currentStage, texture, didLocationChange } from "../../stores";
    import { currentLocation } from "../../stores";
    import { afterUpdate, beforeUpdate, onMount } from "svelte";

    let pxToMeter;

    function textureLoaded(e) {
        texture.set({ texture: e.detail, pxToMeter: pxToMeter });
        
    }

    onMount(() => {
        didLocationChange.set(false)
        currentStage.set(1);
    });
</script>

{#if $texture == null || $didLocationChange}
    <MapTextureLoader
        on:onTextureLoaded={textureLoaded}
        centerCoords={[$currentLocation.lat, $currentLocation.lon]}
        bind:pxToMeter
    ></MapTextureLoader>
{:else}
    <Drawer3D texture={$texture.texture} pxToMeter={$texture.pxToMeter} />
{/if}
