<script>
  import { onMount } from "svelte";
  import { panelArray, currentLocation } from "../../stores";
  import { Line } from "svelte-chartjs";
  import MonthlySumChart from "../../lib/MonthlySumChart.svelte";
  import DailyAverageProductionChart from "../../lib/DailyAverageProductionChart.svelte";
  const URL = "http://127.0.0.1:8000/simulate";

  let what = "";

  onMount(async () => {
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: $currentLocation,
        arrays: $panelArray,
      }),
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
    <DailyAverageProductionChart
      data={data}
    ></DailyAverageProductionChart>
  {/each}
{/if}

