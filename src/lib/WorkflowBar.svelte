<script>
    import {currentStage} from "../stores"
</script>

<div class="d-flex justify-content-start position-absolute w-100" style="background-color: white;">
    <button class="btn btn-primary m-2" >Location</button>

    <button class="btn btn-primary m-2" disabled={$currentStage < 1}>Site Modelling</button>

    <button class="btn btn-primary m-2" disabled={$currentStage < 2}>System Design</button>

    <button class="btn btn-primary m-2" disabled={$currentStage < 3}>Performance</button>

    <button class="btn btn-primary m-2 " disabled={$currentStage < 4}>Report</button>
</div>
