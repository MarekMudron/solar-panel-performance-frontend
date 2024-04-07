<script>
  import { onMount } from "svelte";
  import { stringsStorage, currentLocation } from "../../stores";
  import { Line } from "svelte-chartjs";
  import MonthlySumChart from "../../lib/MonthlySumChart.svelte";
  import DailyAverageProductionChart from "../../lib/DailyAverageProductionChart.svelte";
  import { MathUtils } from "three";
  const URL = "http://127.0.0.1:8000/simulate";

  let what = "";

  function getPayloadBody() {
    let strings = $stringsStorage.map((string) => {
      let nonemptyBlocks =  string.panels.filter(pb => pb.length != 0)
      return {blocks:nonemptyBlocks.map((panelBlock) => {
        return {
          tilt: MathUtils.radToDeg(panelBlock[0].euler.x),
          azimuth: 180,//MathUtils.radToDeg(panelBlock[0].euler.z),
          nameplate_of_one: panelBlock[0].power,
          gamma_pdc_of_one: panelBlock[0].tempCoef,
          num_panels: panelBlock.length
        };
      })};
    });
    return JSON.stringify({ location: $currentLocation, arrays:strings });
  }

  onMount(async () => {
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: getPayloadBody()
    };
    console.log(payload.body);
    await fetch(URL, payload)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        what = data;
      });
  });
</script>

{#if what != ""}
  <MonthlySumChart data={Object.values(what.sums_acrross_months)}></MonthlySumChart>
  {#each Object.values(what.monthly_avgs) as data}
    <DailyAverageProductionChart {data}></DailyAverageProductionChart>
  {/each}
{/if}
