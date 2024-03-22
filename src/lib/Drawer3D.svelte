<script>
    import { onMount } from "svelte";
    import ThreeCanvas from "./ThreeCanvas.svelte";
    import {
        drawSedlova,
        drawIhlanova,
        drawPultova,
        drawValbova,
        toggleMode,
    } from "$lib/three-resources/Interface.js";
    import { addPanel, panels } from "$lib/three-resources/Panels.js";
    import { callUndo, callRedo } from "$lib/three-resources/UndoRedo.js";
    import {  isThreeJsSetup, panelArray } from "../stores";
    import { is2d } from "$lib/three-resources/Mode.js";

    export let texture;
    export let pxToMeter;


    // function simulate() {
    //     let serialized = panels.map((panel) => {
    //         return {
    //             azimuth: panel.euler.z,
    //             tilt: panel.euler.x,
    //             nameplate: 0.5,
    //             gamma_pdc: 0.001,
    //         };
    //     });
    //     panelArray.set(serialized);
    // }

    let visible2d, visible3d;

    $: {
        visible2d = $is2d ? "block" : "none";
        visible3d = $is2d ? "none" : "block";
    }
</script>

{#if texture}
<ThreeCanvas texture={texture}></ThreeCanvas>
{/if}
<!-- <canvas
    id="canvas"
    style="height:calc(100vh - 60px);visibility:{$isThreeJsSetup ? "visible":"hidden"} width:100%; z-index:0; display:block; background-color:#ffaaff"
    bind:this={canv3d} 
></canvas> -->
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
    <!-- <button
        type="button"
        class="btn btn-warning btn-block mb-2"
        style="display:{visible3d}"
        on:click={() => addPanel()}>Add Panel</button
    > -->

    <!-- <a
        type="button"
        class="btn btn-success btn-block mb-2"
        href="/simulation"
        on:click={() => {
            simulate();
        }}>Simulate</a
    > 
</div> -->
