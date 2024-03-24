<script>
    import MapTextureLoader from "$lib/MapTextureLoader.svelte";
    import MapCanvas from "$lib/MapCanvas.svelte";
    import { currentStage, texture, didLocationChange } from "../../stores";
    import { currentLocation } from "../../stores";
    import { onMount } from "svelte";
    import { callUndo, callRedo } from "$lib/three-resources/UndoRedo.js";

    let pxToMeter;


    onMount(() => {
        didLocationChange.set(false);
        currentStage.set(1);
    });
</script>

<MapCanvas />
<!-- 
<div
    class="hstack position-absolute start-0 translate-middle-y"
    style="top:100px;"
>
    <button
        type="button"
        class="btn btn-secondary btn-block mb-2"
        on:click={() => callUndo()}>Undo</button
    >

    <button
        type="button"
        class="btn btn-secondary btn-block mb-2"
        on:click={() => callRedo()}>Redo</button
    >
</div> -->
