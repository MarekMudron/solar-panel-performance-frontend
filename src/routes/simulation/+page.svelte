<script>
  import { onMount } from "svelte";
  import { stringsStorage, currentLocation } from "../../stores";
  import { Line } from "svelte-chartjs";
  import MonthlySumChart from "../../lib/MonthlySumChart.svelte";
  import DailyAverageProductionChart from "../../lib/DailyAverageProductionChart.svelte";
  import { MathUtils } from "three";
  const URL = "http://127.0.0.1:8000/simulate";
  import { currentStage, lastModifiedStage } from "../../stores";
  let response = "";

//   function convertToClockwise(counterclockwiseAzimuth) {
//     // Normalize negative azimuth values to positive equivalents
//     counterclockwiseAzimuth = (counterclockwiseAzimuth < 0) ? 360 + counterclockwiseAzimuth : counterclockwiseAzimuth;
    
//     if (counterclockwiseAzimuth <= 180) {
//         return counterclockwiseAzimuth + 180;
//     } else {
//         return 360 - counterclockwiseAzimuth;
//     }
// }

function convertToClockwise(counterclockwiseAzimuth) {
    // Ensure degrees is within 0 to 360 range
    counterclockwiseAzimuth = counterclockwiseAzimuth % 360;
    if (counterclockwiseAzimuth < 0) {
      counterclockwiseAzimuth += 360; // Convert negative degrees to positive
    }
    return counterclockwiseAzimuth;
}

// function convertToClockwise(counterclockwiseAzimuth) {
//   console.log("AZIMUT", counterclockwiseAzimuth);
//     if (counterclockwiseAzimuth > 180) {
//         return 360 - counterclockwiseAzimuth;
//     } else {
//         return 360 - counterclockwiseAzimuth;
//     }
// }


  function getPayloadBody() {
    let strings = $stringsStorage.map((string) => {
      let nonemptyBlocks =  string.panelBlocks.filter(pb => pb.length != 0)
      return {blocks:nonemptyBlocks.map((panelBlock) => {
        return {
          tilt: MathUtils.radToDeg(-panelBlock[0].euler.x),
          azimuth: convertToClockwise(MathUtils.radToDeg(panelBlock[0].euler.z)),
          nameplate_of_one: panelBlock[0].power,
          gamma_pdc_of_one: panelBlock[0].tempCoef,
          num_panels: panelBlock.length
        };
      })};
    });
    return JSON.stringify({ location: $currentLocation, arrays:strings });
  }

  onMount(async () => {
    if ($currentStage < 3) {
            lastModifiedStage.set(3);
        }
        currentStage.set(3);
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
        response = data;
      });
  });
</script>

{#if response != ""}
  <MonthlySumChart data={Object.values(response.sums_acrross_months)}></MonthlySumChart>
  {#each Object.values(response.monthly_avgs) as data}
    <DailyAverageProductionChart {data}></DailyAverageProductionChart>
  {/each}
{/if}
