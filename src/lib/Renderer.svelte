<script>
    import { onMount } from "svelte";
    import { WebGLRenderer } from "three";
    import Canvas from "./Canvas.svelte";

    export let renderer;
    export let canvas;
    export let scene;

    export function render() {
        renderer.render(scene, canvas);
    }

    onMount(() => {
        renderer = new WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
        });
        renderer.setPixelRatio(
            window.devicePixelRatio ? window.devicePixelRatio : 1,
        );
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    });
</script>
