<script>
    import { activateDeleter } from "$lib/three-resources/system/PanelDeleter";
</script>

<div
    class="hstack position-absolute end-0 translate-middle-y"
    style="top:100px;"
>
    <button
        type="button"
        class="btn btn-danger btn-block mb-2"
        on:click={activateDeleter}>Delete</button
    >
</div>
