<script>
    import MapCanvas from "$lib/MapCanvas.svelte";
    import {
        lastModifiedStage,
        currentStage,
        siteStorage,
        keypoints2dStorage,
        deleteInProgress,
    } from "../../stores";
    import { currentLocation } from "../../stores";
    import { onDestroy, onMount } from "svelte";
    import { callUndo, callRedo } from "$lib/three-resources/UndoRedo.js";
    import { blocks, addBlock } from "$lib/three-resources/Site.js";
    import { setTo2d, setTo3d } from "$lib/three-resources/Mode.js";
    import {
        drawSedlova,
        drawIhlanova,
        drawPultova,
        drawValbova,
        drawPlocha
    } from "$lib/three-resources/Interface.js";
    import { serialize2dKeypoints } from "$lib/three-resources/keypoints-2d/Keypoints2d.js";
    import { activateRemover,deactivateRemover } from "$lib/three-resources/Remover.js";
    import sedlovaIcon from '$lib/assets/sedlova.svg'
    import plochaIcon from '$lib/assets/plocha.svg'
    import pyramidovaIcon from '$lib/assets/pyramidova.svg'
    import valbovaIcon from '$lib/assets/valbova.svg'
    import pultovaIcon from '$lib/assets/pultova.svg'
    import { drawingInProgress } from "../../stores"


    function setAsDirty() {
        lastModifiedStage.set(1);
    }

    function saveSite() {
        siteStorage.set(blocks);
        keypoints2dStorage.set(serialize2dKeypoints());
    }

    function loadSite() {
        if ($siteStorage)
            $siteStorage.forEach((block) => {
                addBlock(block);
            });
    }

    onMount(() => {
        if ($currentStage < 1) {
            lastModifiedStage.set(1);
        }
        loadSite();
        currentStage.set(1);
    });

    onDestroy(() => {
        saveSite();
    });

    let visible2d;
    let visible3d;
    let is2d = true;

    let activeButtonIndex = -1;

    $: {
        visible2d = is2d ? "block" : "none";
        visible3d = is2d ? "none" : "block";
    }
</script>

<div id="modellingstuff">
    <MapCanvas />
</div>

<div id="container"></div>
<a
    type="button"
    class="btn btn-primary btn-block position-absolute bottom-0 end-0 mb-2"
    href="/systemdesign">System Design</a
>

<div
    class="hstack position-absolute start-0 translate-middle-y"
    style="top:100px;"
>
    <div class="btn-group"></div>

    <button
        type="button"
        class="btn btn-secondary btn-block m-1"
        on:click={() => callUndo()}><i class="fa fa-undo" aria-hidden="true"></i></button
    >

    <button
        type="button"
        class="btn btn-secondary btn-block m-1"
        on:click={() => callRedo()}><i class="fa fa-redo" aria-hidden="true"></i></button
    >
</div>

<div
    class="hstack position-absolute end-0 translate-middle-y btn-group"
    style="top:100px;"
>
    <input
        type="radio"
        class="btn-check"
        name="modeOptions"
        id="radioto2d"
        autocomplete="off"
        checked={is2d}
        on:click={() => {
            is2d = true;
            setTo2d();
            deactivateRemover()
        }}
    />
    <label class="btn btn-outline-warning mode-button-label" for="radioto2d"
        >2D</label
    >

    <input
        type="radio"
        class="btn-check"
        name="modeOptions"
        id="radioto3d"
        autocomplete="off"
        checked={!is2d}
        on:click={() => {
            is2d = false;
            setTo3d();
            deactivateRemover()
        }}
    />
    <label class="btn btn-outline-warning mode-button-label" for="radioto3d"
        >3D</label
    >

    
</div>

<div class="vstack position-absolute top-50 start-0 translate-middle-y">
    <button
        type="button"
        class="btn {activeButtonIndex==0?'btn-primary':'btn-secondary'} btn-block mb-2"
        style="display:{visible2d};"
        disabled={$drawingInProgress}
        on:click={() => {
            setAsDirty();
            drawSedlova();
            activeButtonIndex = 0;
        }}><img src={sedlovaIcon} height="30" width="30"></button
    >
    <button
        type="button"
        class="btn {activeButtonIndex==1?'btn-primary':'btn-secondary'} btn-block mb-2"
        style="display:{visible2d};"
        disabled={$drawingInProgress}
        on:click={() => {
            setAsDirty();
            drawIhlanova();
            activeButtonIndex = 1;
        }}><img src={pyramidovaIcon} height="30" width="30"></button
    >
    <button
        type="button"
        class="btn {activeButtonIndex==2?'btn-primary':'btn-secondary'} btn-block mb-2"
        style="display:{visible2d}"
        disabled={$drawingInProgress}
        on:click={() => {
            setAsDirty();
            drawValbova();
            activeButtonIndex = 2;
        }}><img src={valbovaIcon} height="30" width="30"></button
    >
    <button
        type="button"
        class="btn {activeButtonIndex==3?'btn-primary':'btn-secondary'} btn-block mb-2"
        style="display:{visible2d};"
        disabled={$drawingInProgress}
        on:click={() => {
            setAsDirty();
            drawPultova();
            activeButtonIndex = 3;
        }}><img src={pultovaIcon} height="30" width="30"></button
    >
    <button
        type="button"
        class="btn {activeButtonIndex==4?'btn-primary':'btn-secondary'} btn-block mb-2"
        style="display:{visible2d}"
        disabled={$drawingInProgress}
        on:click={() => {
            setAsDirty();
            drawPlocha();
            activeButtonIndex = 4;
        }}><img src={plochaIcon} height="30" width="30"></button
    >

    <button
        type="button"
        class="btn btn-{$deleteInProgress?"outline-":""}danger btn-block mb-2"
        style="display:{visible2d} height:30px"
        disabled={$drawingInProgress}
        on:click={() => {
            activateRemover();
            activeButtonIndex = -1;
        }}><i class="fa-solid fa-trash"></i></button
    >
</div>

<style>
    .mode-button-label:not(active) {
        background-color: black;
        color: rgba(128, 128, 128, 0.5);
    }

    .label {
        text-shadow: -1px 1px 1px rgb(0,0,0);
        margin-left: 25px;
        font-size: 20px;
    }
</style>
