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

    function activateTemplate(template) {
        if (hasAnyActiveString()) {
            setActiveTemplate(template);
        }
    }
</script>

<div class="vstack position-absolute top-50 start-0 translate-middle-y">
    <div class="container">
        {#each $panelTemplates as template}
            <div class="row">
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
                        class="btn btn-secondary mb-2 btn-block"
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
    </div>
    <button
        class="btn btn-primary btn-block mb-2"
        data-bs-toggle="modal"
        data-bs-target="#newPanelDialog"
        href="#">Add Template</button
    >
</div>

<NewPanelModal on:panelAdded={addPanelTemplate}></NewPanelModal>
