<script>
    import {stageInProgress, currentStage} from "../stores"
</script>

<div class="d-flex justify-content-start  w-100" style="background-color: white; height:60px">
    <a href="/"><button class="btn btn-primary m-2" >Location</button></a>

    <a href="/design"><button class="btn btn-primary m-2" disabled={$stageInProgress <= 0}>Site Modelling</button></a>

    <a href="/systemdesign"><button class="btn btn-primary m-2" disabled={$stageInProgress <= 1}>System Design</button></a>

    <a href="/simulation" class="btn btn-primary m-2" disabled={$currentStage <= 2}>Performance</a>

    <button class="btn btn-primary m-2 " disabled={$currentStage <= 3}>Report</button> 
</div>
