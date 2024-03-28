<script>
    import MapTextureLoader from "$lib/MapTextureLoader.svelte";
    import MapCanvas from "$lib/MapCanvas.svelte";
    import { stageInProgress, texture, didLocationChange } from "../../stores";
    import { addBlock } from "$lib/three-resources/Site.js";
    import { siteStorage, currentStage } from "../../stores";
    import { onMount, onDestroy } from "svelte";
    import { callUndo, callRedo } from "$lib/three-resources/UndoRedo.js";
    import {
        deactivate2dKeypoints,
        activate2dKeypoints,
    } from "$lib/three-resources/keypoints-2d/Keypoints2d.js";
    import {
        activate3dKeypoints,
        deactivate3dKeypoints,
    } from "$lib/three-resources/keypoints-3d/Keypoints3d.js";
    import { setTo2d, setTo3d } from "$lib/three-resources/Mode.js";
    import NewPanelModal from "../../lib/NewPanelModal.svelte";
    import { setActiveTemplate } from "$lib/three-resources/Panels.js";
    import { panelTemplates } from "../../stores";

    function setAsDirty() {
        stageInProgress.set(1);
    }

    function loadSite() {
        if ($siteStorage)
            $siteStorage.forEach((block) => {
                addBlock(block);
            });
    }

    onMount(() => {
        if ($currentStage < 2) {
            stageInProgress.set(1);
        }
        loadSite();
        setTo3d();
        deactivate2dKeypoints();
        deactivate3dKeypoints();
        currentStage.set(1);
    });

    function addPanelTemplate(e) {
        panelTemplates.update((templates) => ([...templates, e.detail]));
    }
</script>

<MapCanvas />

<div class="vstack position-absolute top-50 start-0 translate-middle-y">
    <!-- Example split danger button -->
    <div class="btn-group">
        <button type="button" class="btn btn-primary">Put Panels</button>
        <button
            type="button"
            class="btn btn-primary dropdown-toggle dropdown-toggle-split"
            data-bs-toggle="dropdown"
            aria-expanded="false"
        >
            <span class="visually-hidden">Toggle Dropdown</span>
        </button>
        <ul class="dropdown-menu">
            {#each $panelTemplates as template}
                <li>
                    <a
                        class="dropdown-item"
                        on:click={() => setActiveTemplate(template)}
                        href="#">{template.name}</a
                    >
                </li>
            {/each}
            <li><hr class="dropdown-divider" /></li>
            <li>
                <a
                    class="dropdown-item"
                    data-bs-toggle="modal"
                    data-bs-target="#newPanelDialog"
                    href="#">Add Template</a
                >
            </li>
        </ul>
    </div>
</div>

<!-- Modal -->
<NewPanelModal on:panelAdded={addPanelTemplate}></NewPanelModal>
