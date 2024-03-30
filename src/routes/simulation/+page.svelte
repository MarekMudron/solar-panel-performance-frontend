<script>
  import { onMount } from "svelte";
  import { stringsStorage, currentLocation } from "../../stores";
  import { Line } from "svelte-chartjs";
  import MonthlySumChart from "../../lib/MonthlySumChart.svelte";
  import DailyAverageProductionChart from "../../lib/DailyAverageProductionChart.svelte";
  const URL = "http://127.0.0.1:8000/simulate";

  let what = "";

  function getPayloadBody() {
    let strings = $stringsStorage.map((string) => {
      return {panels:string.panels.map((panel) => {
        return {
          tilt: panel.euler.x,
          azimuth: panel.euler.z,
          nameplate: panel.power,
          gamma_pdc: panel.tempCoef,
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
  <MonthlySumChart data={Object.values(what.monthly_sum)}></MonthlySumChart>
  {#each Object.values(what.monthly_avg_by_time) as data}
    <DailyAverageProductionChart {data}></DailyAverageProductionChart>
  {/each}
{/if}
