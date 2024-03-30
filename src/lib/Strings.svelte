<script>
    import {
        createNew,
        setActiveString,
        deleteString,
    } from "$lib/three-resources/system/Strings.js";
    import { stringsStorage } from "../stores";

</script>

<div class="vstack position-absolute start-0" style="top:100px;">
    <div class="container">
        {#each $stringsStorage as string, index}
            <div class="row">
                <div class="col-8">
                    <input
                        type="radio"
                        class="btn-check"
                        name="strings"
                        id="string{index + 1}"
                        checked={string.isActive}
                        autocomplete="off"
                        on:click={() => setActiveString(string)}
                    />
                    <label
                        class="btn btn-secondary mb-2"
                        for="string{index + 1}">String {index + 1}</label
                    >
                </div>
                <div class="col-2">
                    <button
                        class="btn btn-danger"
                        on:click={() => deleteString(string)}
                        ><i class="fa-solid fa-trash"></i></button
                    >
                </div>
            </div>
        {/each}
    </div>
    <button class="btn btn-primary btn-block mb-2" on:click={createNew}
        >New String</button
    >
</div>
