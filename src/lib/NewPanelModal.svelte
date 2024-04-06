<script>
    import { createEventDispatcher } from "svelte";
    import rectangle from "$lib/assets/rectangle.jpg";
    const dispatch = createEventDispatcher();
    let height;
    let width;
    let pp;
    let pmpp;
    let name;

    function asModel() {
        return { name, height: height / 1000, width: width / 1000, pp, pmpp };
    }
</script>

<div
    class="modal fade"
    id="newPanelDialog"
    tabindex="-1"
    aria-labelledby="newPanelDialogLabel"
    aria-hidden="true"
>
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="newPanelDialogLabel">
                    New Panel Template
                </h1>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                ></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="container">
                        <div class="row">
                            <div class="col">
                                <label for="nameInput" class="form-label"
                                    >Name</label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    id="nameInput"
                                    bind:value={name}
                                />
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-4 align-self-center">
                                <label for="heightInput" class="form-label"
                                    >Height [mm]</label
                                >
                                <input
                                    type="number"
                                    class="form-control"
                                    id="heightInput"
                                    step="100"
                                    bind:value={height}
                                />
                            </div>
                            <div class="col-4">
                                <img
                                    alt="rectangle"
                                    src={rectangle}
                                    class="py-2"
                                />
                            </div>
                        </div>

                        <div class="row justify-content-center">
                            <div class="col-4">
                                <label for="widthInput" class="form-label"
                                    >Width[mm]</label
                                >
                                <input
                                    type="number"
                                    class="form-control"
                                    id="widthInput"
                                    step="100"
                                    bind:value={width}
                                />
                            </div>
                        </div>

                        <div class="row">
                            <div class="col">
                                <label for="ppinput" class="form-label"
                                    >Peak Performance [W]</label
                                >
                                <input
                                    type="number"
                                    class="form-control"
                                    id="ppinput"
                                    step="100"
                                    bind:value={pp}
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <label for="pmppinput" class="form-label"
                                    >Temperature Coefficient (PMPP) [%/°C]</label
                                >
                                <input
                                    type="number"
                                    class="form-control"
                                    id="pmppinput"
                                    step="0.05"
                                    bind:value={pmpp}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">Close</button
                >
                <button
                    type="button"
                    data-bs-dismiss="modal"
                    class="btn btn-primary"
                    on:click={() => dispatch("panelAdded", asModel())}
                    >Add Panel</button
                >
            </div>
        </div>
    </div>
</div>
