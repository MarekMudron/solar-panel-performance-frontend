<script>
    import NewPanelModal from "$lib/NewPanelModal.svelte";
    import { setActiveTemplate } from "$lib/three-resources/system/Panels.js";
    import { panelTemplates, stringsStorage } from "../stores";
    import { onMount } from "svelte";
    import { hasAnyActiveString } from "$lib/three-resources/system/Strings.js";

    function addPanelTemplate(e) {
        panelTemplates.update((templates) => [...templates, e.detail]);
    }

    onMount(() => {
        panelTemplates.update((templates) => [
            ...templates,
            { name: "template", height: 1, width: 0.5, pp: 10, pmpp: 10 },
        ]);
    });

    let currentTemplate;

    function activateTemplate(template) {
        if (hasAnyActiveString()) {
            currentTemplate = template;
            let clone = { ...template };
            if (!isStickyAlignment) clone.alignmentAngle = alignmentAngle;
            else clone.alignmentAngle = null;
            if (!isVertical) {
                let w = clone.width;
                clone.width = clone.height;
                clone.height = w;
            }
            setActiveTemplate(clone);
        }
    }

    var isVertical = false;
    var isStickyAlignment = true;
    var alignmentAngle = 45;
</script>

<div class="vstack position-absolute top-50 start-0 translate-middle-y">
    <div class="container bg-light rounded p-2">
        <div class="col">
            <div class="hstack btn-group">
                <input
                    type="radio"
                    class="btn-check"
                    name="modeOptions"
                    id="radioto2d"
                    autocomplete="off"
                    checked={isVertical}
                    on:click={() => {
                        isVertical = true;
                        activateTemplate(currentTemplate);
                    }}
                />
                <label
                    class="btn btn-outline-warning mode-button-label"
                    for="radioto2d">▯</label
                >

                <input
                    type="radio"
                    class="btn-check"
                    name="modeOptions"
                    id="radioto3d"
                    autocomplete="off"
                    checked={!isVertical}
                    on:click={() => {
                        isVertical = false;
                        activateTemplate(currentTemplate);
                    }}
                />
                <label
                    class="btn btn-outline-warning mode-button-label"
                    for="radioto3d">▭</label
                >
            </div>

            <div class="">
                <div class="form-check">
                    <input
                        class="form-check-input"
                        type="radio"
                        name="exampleRadios"
                        id="exampleRadios1"
                        value="option1"
                        checked={isStickyAlignment}
                        on:click={() => {
                            isStickyAlignment = true;
                            activateTemplate(currentTemplate)
                        }}
                    />
                    <label class="form-check-label" for="exampleRadios1">
                        Sticky
                    </label>
                </div>
                <div class="form-check">
                    <div>
                        <label class="form-check-label" for="exampleRadios2">
                            Fixed Angle [°C] <input
                                type="number"
                                class="form-control"
                                id="ppinput"
                                step="1"
                                bind:value={alignmentAngle}
                                disabled={isStickyAlignment}
                                on:change={() =>
                                    activateTemplate(currentTemplate)}
                            />
                        </label>
                        <input
                            class="form-check-input"
                            type="radio"
                            name="exampleRadios"
                            id="exampleRadios2"
                            value="option2"
                            checked={!isStickyAlignment}
                            on:click={() => {
                                isStickyAlignment = false;
                                activateTemplate(currentTemplate)
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="col rounded bg-secondary">
            {#each $panelTemplates as template}
                <div class="row m-1 bro rounded">
                    <div class="col-8">
                        <input
                            type="radio"
                            class="btn-check"
                            name="panelTemplates"
                            id={template.name}
                            autocomplete="off"
                            on:click={() => activateTemplate(template)}
                        />
                        <label
                            class="btn btn-light m-1 btn-block"
                            for={template.name}>{template.name}</label
                        >
                    </div>
                    <div class="col-2">
                        <button
                            class="btn btn-danger"
                            on:click={() => deleteTemplate(template)}
                            ><i class="fa-solid fa-trash"></i></button
                        >
                    </div>
                </div>
            {/each}
            <button
                class="btn btn-primary w-100 btn-block mb-2"
                data-bs-toggle="modal"
                data-bs-target="#newPanelDialog"
                href="#">Add Template</button
            >
        </div>
    </div>
</div>

<NewPanelModal on:panelAdded={addPanelTemplate}></NewPanelModal>

<style>
    .mode-button-label:not(active) {
        background-color: black;
        color: rgba(128, 128, 128, 0.5);
    }
</style>
