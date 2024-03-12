<script>
    import { onMount } from "svelte";
    import { setup } from "$lib/three-resources/Canvas.js";
    import { initMapPlane } from "$lib/three-resources/MapPlane.js";
    import {
        drawSedlova,
        drawIhlanova,
        drawPultova,
        drawValbova,
        toggleMode,
    } from "$lib/three-resources/Interface.js";

    import { useRotate2d } from "$lib/three-resources/ToolSet.js";

    let canv3d;
    export let texture;
    export let pxToMeter;

    export function activate() {
        setup(canv3d);
    }

    onMount(() => {
        activate();
    });

    $: {
        if (texture) {
            initMapPlane(texture, texture.width * pxToMeter);
        }
    }
</script>

<canvas
    style="height:100%; width:100%; z-index:20; display:block"
    id="canv3d"
    bind:this={canv3d}
></canvas>

<div class="vstack position-absolute top-50 start-0 translate-middle-y">
    <button
        type="button"
        class="btn btn-primary btn-block mb-2"
        on:click={() => toggleMode()}>2d/3d</button
    >
    <button
        type="button"
        class="btn btn-primary btn-block mb-2"
        on:click={() => drawSedlova()}>Sedlova strecha</button
    >
    <button
        type="button"
        class="btn btn-primary btn-block mb-2"
        on:click={() => drawIhlanova()}>Ihlanova strecha</button
    >
    <button
        type="button"
        class="btn btn-primary btn-block mb-2"
        on:click={() => drawValbova()}>Valbova strecha</button
    >
    <button
        type="button"
        class="btn btn-primary btn-block mb-2"
        on:click={() => drawPultova()}>Pultova strecha</button
    >
    <button
        type="button"
        class="btn btn-primary btn-block mb-2" disabled
        on:click={() => useRotate2d()}>Rotate 2d</button
    >

    <button
        type="button"
        class="btn btn-primary btn-block mb-2" disabled
        on:click={() => {}}>Move 2d</button
    >
    <!--    <button
        type="button"
        class="btn btn-primary btn-block mb-2"
        on:click={() => activateCommand(COMMANDS.addSedlova)}>Building Height</button
    >
    <button
        type="button"
        class="btn btn-primary btn-block mb-2"
        on:click={() => activateCommand(COMMANDS.addSedlova)}>Rotate</button
    >
    <button
        type="button"
        class="btn btn-primary btn-block mb-2"
        on:click={() => activateCommand(COMMANDS.addSedlova)}>Resize</button
    >
    <button
        type="button"
        class="btn btn-primary btn-block mb-2"
        on:click={() => activateCommand(COMMANDS.addSedlova)}>Move</button
    >
    <button
        type="button"
        class="btn btn-primary btn-block mb-2"
        on:click={() => activateCommand(COMMANDS.addSedlova)}>Valb</button
    >
    <button
        type="button"
        class="btn btn-secondary btn-block mb-2"
        on:click={() => activateCommand(COMMANDS.addSedlova)}>Add Panel</button
    >
    <button
        type="button"
        class="btn btn-secondary btn-block mb-2"
        on:click={() => activateCommand(COMMANDS.addSedlova)}>Move Panel</button
    > -->
</div>
