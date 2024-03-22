<script>
    import {currentStage} from "../stores"
</script>

<div class="d-flex justify-content-start  w-100" style="background-color: white; height:60px">
    <a href="/"><button class="btn btn-primary m-2" >Location</button></a>

    <a href="/design"><button class="btn btn-primary m-2" disabled={$currentStage < 1}>Site Modelling</button></a>

    <button class="btn btn-primary m-2" disabled={$currentStage < 2}>System Design</button>

    <button class="btn btn-primary m-2" disabled={$currentStage < 3}>Performance</button>

    <button class="btn btn-primary m-2 " disabled={$currentStage < 4}>Report</button>
</div>
