<script>
    import MapCanvas from "$lib/MapCanvas.svelte";
    import { lastModifiedStage } from "../../stores";
    import { currentStage } from "../../stores";
    import { onMount } from "svelte";
    import { deactivate2dKeypoints } from "$lib/three-resources/keypoints-2d/Keypoints2d.js";
    import { deactivate3dKeypoints } from "$lib/three-resources/keypoints-3d/Keypoints3d.js";
    import { setTo3d } from "$lib/three-resources/Mode.js";
    import PanelTemplates from "../../lib/PanelTemplates.svelte";
    import Strings from "../../lib/Strings.svelte";
    import PanelDeleter from "../../lib/PanelDeleter.svelte";
    import { stringsStorage } from "../../stores";
    // function setAsDirty() {
    //     lastModifiedStage.set(2);
    // }

    onMount(() => {
        if ($currentStage < 2) {
            lastModifiedStage.set(2);
        }
        setTo3d();
        deactivate2dKeypoints();
        deactivate3dKeypoints();
        currentStage.set(2);
    });
</script>

<div id="modellingstuff">
    <MapCanvas />
</div>

<PanelDeleter></PanelDeleter>

<a
    type="button"
    class="btn btn-success btn-block position-absolute bottom-0 end-0 mb-2 {$stringsStorage.length == 0 ? "disabled" : ""}"
    href="/simulation"
    
    >Simulate
</a>

<Strings></Strings>


<PanelTemplates></PanelTemplates>
