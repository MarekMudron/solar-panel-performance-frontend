<script>
    import { onMount } from "svelte";
    import Canvas from "./Canvas.svelte";
    import { PerspectiveCamera } from "three";

    export let camera;
    export let canvas;

    onMount(() => {
        camera = new PerspectiveCamera(
            45,
            canvas.clientWidth / canvas.clientHeight,
            1,
            1000,
        );
        camera.position.set(0, 0, 100);
        camera.lookAt(0, 0, 10);
        camera.up.set(0, 0, 1);
        camera.layers.enableAll();
    });
</script>