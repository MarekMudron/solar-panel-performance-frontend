<script>
    import { onDestroy, onMount } from "svelte";
    import { setup } from "$lib/three-resources/Canvas.js";
    import { initMapPlane } from "$lib/three-resources/MapPlane.js";
    import {
        drawSedlova,
        drawIhlanova,
        drawPultova,
        drawValbova,
        toggleMode,
    } from "$lib/three-resources/Interface.js";
    import { callUndo, callRedo } from "$lib/three-resources/UndoRedo.js";
    import {  siteStorage } from "../stores";
    import { is2d } from "$lib/three-resources/Mode.js";
    import {blocks, addBlock} from "$lib/three-resources/Site.js";

    let canv3d;
    export let texture;
    export let pxToMeter;

    export function activate() {
        setup(canv3d);
        if($siteStorage != null) {
            $siteStorage.forEach(element => {
                addBlock(element)
            });
        }
        initMapPlane(texture, texture.width * pxToMeter);
    }

    onMount(() => {
        activate();
    });

    onDestroy(() => {
        siteStorage.set(blocks)
    })

    let visible2d, visible3d;

    $: {
        visible2d = $is2d ? "block" : "none";
        visible3d = $is2d ? "none" : "block";
    }
</script>

<canvas
    id="canvas"
    style="height:calc(100vh - 60px);visibility:visible; width:100%; z-index:0; display:block; background-color:#000000"
    bind:this={canv3d}
></canvas>

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

<button
        type="button"
        class="btn btn-dark btn-block mb-2 position-absolute end-0 translate-middle-y"
        style="top:100px"
        on:click={() => toggleMode()}>2d/3d</button
    >

<div class="vstack position-absolute top-50 start-0 translate-middle-y">
    
    <button
        type="button"
        class="btn btn-primary btn-block mb-2"
        style="display:{visible2d}"
        on:click={() => drawSedlova()}>Sedlova strecha</button
    >
    <button
        type="button"
        class="btn btn-primary btn-block mb-2"
        style="display:{visible2d}"
        on:click={() => drawIhlanova()}>Ihlanova strecha</button
    >
    <button
        type="button"
        class="btn btn-primary btn-block mb-2"
        style="display:{visible2d}"
        on:click={() => drawValbova()}>Valbova strecha</button
    >
    <button
        type="button"
        class="btn btn-primary btn-block mb-2"
        style="display:{visible2d}"
        on:click={() => drawPultova()}>Pultova strecha</button
    >
</div>
