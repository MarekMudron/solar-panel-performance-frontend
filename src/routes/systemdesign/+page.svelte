<script>
    import MapTextureLoader from "$lib/MapTextureLoader.svelte";
    import MapCanvas from "$lib/MapCanvas.svelte";
    import { stageInProgress, texture, didLocationChange } from "../../stores";
    import { currentLocation } from "../../stores";
    import { onMount } from "svelte";
    import { callUndo, callRedo } from "$lib/three-resources/UndoRedo.js";

    let pxToMeter;


    onMount(() => {
        currentLocation.set(2);
        stageInProgress.set(2);
    });
</script>

<MapCanvas />