<script>
    import {lastModifiedStage, currentStage} from "../stores"

    $: {
        console.log("last modified stage: ", $lastModifiedStage, " current stage: ", $currentStage);
    }
</script>


<style>
    a.disabled {
        pointer-events: none;
        cursor: default;
    }   
</style>

<div class="d-flex justify-content-start  w-100" style="background-color: white; height:60px">
    <a href="/"><button class="btn {$currentStage == 0 ? "btn-info" : ""} btn-secondary m-2 " >Location</button></a>

    <a href="/design"  class="{$lastModifiedStage <= 0 ? "disabled" : ""}"><button class="btn btn{$lastModifiedStage <= 0 ? "-outline" : ""}-secondary m-2 {$currentStage == 1 ? "btn-info" : ""}" disabled={$lastModifiedStage <= 0}>Site Modelling</button></a>

    <a href="/systemdesign" class="{$lastModifiedStage <= 1 ? "disabled" : ""}"><button class="btn btn{$lastModifiedStage <= 1 ? "-outline" : ""}-secondary m-2 {$currentStage == 2 ? "btn-info" : ""}" disabled={$lastModifiedStage <= 1}>System Design</button></a>

    <a href="/simulation" class="{$lastModifiedStage <= 2 ? "disabled" : ""}"><button class="btn btn{$lastModifiedStage <= 2 ? "-outline" : ""}-secondary m-2 {$currentStage == 3 ? "btn-info" : ""}" disabled={$lastModifiedStage <= 2}>Report</button></a>
</div>
