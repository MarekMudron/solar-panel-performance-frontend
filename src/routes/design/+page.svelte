<script>
    import MapCanvas from "$lib/MapCanvas.svelte";
    import { stageInProgress,currentStage, siteStorage, keypoints2dStorage } from "../../stores";
    import { currentLocation } from "../../stores";
    import { onDestroy, onMount } from "svelte";
    import { callUndo, callRedo } from "$lib/three-resources/UndoRedo.js";
    import { blocks, addBlock } from "$lib/three-resources/Site.js";
    import {setTo2d, setTo3d} from "$lib/three-resources/Mode.js";
    import {drawSedlova, drawIhlanova, drawPultova, drawValbova} from "$lib/three-resources/Interface.js";
    import {serialize2dKeypoints } from "$lib/three-resources/keypoints-2d/Keypoints2d.js";

    function setAsDirty() {
        stageInProgress.set(1)
    }

    function saveSite() {
        siteStorage.set(blocks)
        keypoints2dStorage.set(serialize2dKeypoints())
    }

    function loadSite() {
        if($siteStorage)
        $siteStorage.forEach(block => {
            addBlock(block)
        });
    }

    onMount(() => {
        if($currentStage < 1) {
            stageInProgress.set(1)
        }
        loadSite();
        currentStage.set(1);
    });

    onDestroy(() => {
        saveSite();
    })

    let visible2d;
    let visible3d;
    let is2d = true;

    $: {
        visible2d = is2d ? "block" : "none";
        visible3d = is2d ? "none" : "block";
    }    
</script>

<MapCanvas />

<a
    type="button"
    class="btn btn-primary btn-block position-absolute bottom-0 end-0 mb-2"
    href="/systemdesign">System Design</a
>

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
</div>

<div
    class="hstack position-absolute end-0 translate-middle-y"
    style="top:100px;"
>
    <button
        type="button"
        class="btn btn-warning btn-block mb-2"
        on:click={() => {is2d=true;setTo2d()}}>2d</button
    >

    <button
        type="button"
        class="btn btn-warning btn-block mb-2"
        on:click={() => {is2d=false;setTo3d()}}>3d</button
    >
</div>

<div class="vstack position-absolute top-50 start-0 translate-middle-y">
    
    <button
        type="button"
        class="btn btn-primary btn-block mb-2"
        style="display:{visible2d}"
        on:click={() => {setAsDirty();drawSedlova()}}>Sedlova strecha</button
    >
    <button
        type="button"
        class="btn btn-primary btn-block mb-2"
        style="display:{visible2d}"
        on:click={() => {setAsDirty();drawIhlanova()}}>Ihlanova strecha</button
    >
    <button
        type="button"
        class="btn btn-primary btn-block mb-2"
        style="display:{visible2d}"
        on:click={() => {setAsDirty();drawValbova()}}>Valbova strecha</button
    >
    <button
        type="button"
        class="btn btn-primary btn-block mb-2"
        style="display:{visible2d}"
        on:click={() => {setAsDirty();drawPultova()}}>Pultova strecha</button
    >
</div>
