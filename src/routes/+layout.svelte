<script>
    import WorkflowBar from "../lib/WorkflowBar.svelte";
</script>

<div class="d-flex flex-column" style="100vh;">
    <WorkflowBar></WorkflowBar>
    <div class=" flex-grow-1 d-flex flex-column">
        <slot />
    </div>
</div>
