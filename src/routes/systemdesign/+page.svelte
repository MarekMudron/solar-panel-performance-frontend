<script>
    import MapTextureLoader from "$lib/MapTextureLoader.svelte";
    import Drawer2D from "$lib/Drawer2D.svelte";
    import Drawer3D from "$lib/Drawer3D.svelte";
    import { currentStage, texture, didLocationChange } from "../../stores";
    import { currentLocation } from "../../stores";
    import { afterUpdate, beforeUpdate, onMount } from "svelte";


    onMount(() => {
        didSiteChange.set(false)
        currentStage.set(2);
    });
</script>


    <Drawer3D texture={$texture.texture} pxToMeter={$texture.pxToMeter} />

