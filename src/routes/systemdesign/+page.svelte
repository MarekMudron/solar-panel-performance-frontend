<script>
    import MapTextureLoader from "$lib/MapTextureLoader.svelte";
    import MapCanvas from "$lib/MapCanvas.svelte";
    import { stageInProgress, texture, didLocationChange } from "../../stores";
    import { addBlock } from "$lib/three-resources/Site.js";
    import { siteStorage, currentStage, panelsStorage } from "../../stores";
    import { onMount, onDestroy } from "svelte";
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
    import {
        setActiveTemplate,
        panelBlocks,
        setOnPanelsAdded,
    } from "$lib/three-resources/Panels.js";
    import { panelTemplates } from "../../stores";

    function setAsDirty() {
        stageInProgress.set(2);
    }

    function loadSite() {
        if ($siteStorage)
            $siteStorage.forEach((block) => {
                addBlock(block);
            });
    }

    let refreshPanelBlocks = false;

    onMount(() => {
        if ($currentStage < 2) {
            stageInProgress.set(2);
        }
        loadSite();
        setTo3d();
        deactivate2dKeypoints();
        deactivate3dKeypoints();
        setOnPanelsAdded(() => {
            panelsStorage.set(panelBlocks);
        });
        currentStage.set(2);
    });

    function savePanels() {
        panelsStorage.set(panelBlocks);
    }

    onDestroy(() => {
        savePanels();
    });

    function addPanelTemplate(e) {
        panelTemplates.update((templates) => [...templates, e.detail]);
    }

    panelTemplates.update((templates) => [
        ...templates,
        { name: "template", height: 1, width: 0.5, pp: 10, pmpp: 10 },
    ]);
</script>

<MapCanvas />

<div
    class="vstack position-absolute start-0 "
    style="top:100px;"
>
        {#each $panelsStorage as block}
            <button class="btn btn-warning btn-block mb-2">String</button>
        {/each}
</div>

<a
    type="button"
    class="btn btn-success btn-block position-absolute bottom-0 end-0 mb-2"
    href="/simulation">Simulate</a
>

<div class="vstack position-absolute top-50 start-0 translate-middle-y">
    {#each $panelTemplates as template}
        <button
            class="btn btn-secondary btn-block mb-2"
            on:click={() => setActiveTemplate(template)}>{template.name}</button
        >
    {/each}
    <button
        class="btn btn-primary btn-block mb-2"
        data-bs-toggle="modal"
        data-bs-target="#newPanelDialog"
        href="#">Add Template</button
    >
</div>

<NewPanelModal on:panelAdded={addPanelTemplate}></NewPanelModal>
