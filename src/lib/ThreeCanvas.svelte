<script>
    import { afterUpdate, onMount } from "svelte";
    import Camera from "./Camera.svelte";
    import Canvas from "./Canvas.svelte";
    import Renderer from "./Renderer.svelte";
    import { initMapPlane } from "$lib/three-resources/MapPlane.js";
    import Scene from "./Scene.svelte";

    let canvas_element;
    export let texture;

    let scene;
    let renderer;
    let camera;

    function update() {
        requestAnimationFrame(update);
        renderer.render(scene.scene, camera.camera);
    }

    // onMount(() => {
    //     update();
    // });

    $: {
        if(renderer != undefined && scene != undefined && camera != undefined) {
            scene.initMapPlane(texture, 3000)
            update()
        }
    }
</script>

<Canvas bind:canvas_element />
{#if canvas_element}
    <Camera bind:this={camera} canvas={canvas_element} />
    <Scene bind:this={scene}></Scene>
    <Renderer bind:this={renderer} scene={scene} canvas={canvas_element}/>
   
{/if}
