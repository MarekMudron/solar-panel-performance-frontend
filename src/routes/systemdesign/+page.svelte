<script>
    import MapCanvas from "$lib/MapCanvas.svelte";
    import { stageInProgress } from "../../stores";
    import { addBlock } from "$lib/three-resources/Site.js";
    import { siteStorage, currentStage } from "../../stores";
    import { onMount, onDestroy } from "svelte";
    import { deactivate2dKeypoints } from "$lib/three-resources/keypoints-2d/Keypoints2d.js";
    import { deactivate3dKeypoints } from "$lib/three-resources/keypoints-3d/Keypoints3d.js";
    import { setTo3d } from "$lib/three-resources/Mode.js";
    import NewPanelModal from "../../lib/NewPanelModal.svelte";
    import { setActiveTemplate } from "$lib/three-resources/system/Panels.js";
    import { panelTemplates, stringsStorage } from "../../stores";
    import {
        createNew,
        setActiveString,
    } from "$lib/three-resources/system/Strings.js";
    import {
        activateDeleter,
    } from "$lib/three-resources/system/PanelDeleter.js";

    function setAsDirty() {
        stageInProgress.set(2);
    }

    function loadSite() {
        if ($siteStorage)
            $siteStorage.forEach((block) => {
                addBlock(block);
            });
    }

    onMount(() => {
        if ($currentStage < 2) {
            stageInProgress.set(2);
        }
        loadSite();
        setTo3d();
        deactivate2dKeypoints();
        deactivate3dKeypoints();
        currentStage.set(2);
        stringsStorage.subscribe((ss) => {});
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
    class="hstack position-absolute end-0 translate-middle-y"
    style="top:100px;visibility:{$stringsStorage.length > 0 ? 'visible' : 'hidden'}"
>
    <button
        type="button"
        class="btn btn-danger btn-block mb-2"
        on:click={activateDeleter}>Delete</button
    >
</div>

<div class="vstack position-absolute start-0" style="top:100px;">
    {#each $stringsStorage as string, index}
        <input
            type="radio"
            class="btn-check"
            name="strings"
            id="string{index + 1}"
            checked={string.isActive}
            autocomplete="off"
            on:click={() => setActiveString(string)}
        />
        <label class="btn btn-secondary mb-2" for="string{index + 1}"
            >String {index + 1}</label
        >
    {/each}
    <button class="btn btn-primary btn-block mb-2" on:click={createNew}
        >New String</button
    >
</div>

<a
    type="button"
    class="btn btn-success btn-block position-absolute bottom-0 end-0 mb-2"
    style="visibility:{$stringsStorage.length > 0 ? 'visible' : 'hidden'}"
    href="/simulation">Simulate</a
>

<div
    class="vstack position-absolute top-50 start-0 translate-middle-y"
    style="visibility:{$stringsStorage.length > 0 ? 'visible' : 'hidden'}"
>
    {#each $panelTemplates as template}
        <input
            type="radio"
            class="btn-check"
            name="panelTemplates"
            id={template.name}
            autocomplete="off"
            on:click={() => setActiveTemplate(template)}
        />
        <label class="btn btn-secondary mb-2 btn-block" for={template.name}
            >{template.name}</label
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
