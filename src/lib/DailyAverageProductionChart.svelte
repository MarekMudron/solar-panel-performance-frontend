<script>
    import {
        Chart,
        Title,
        Tooltip,
        Legend,
        LineElement,
        CategoryScale,
        LinearScale,
        PointElement
    } from "chart.js";
    import { Line } from "svelte-chartjs";

    Chart.register(
        Title,
        Tooltip,
        Legend,
        LineElement,
        CategoryScale,
        LinearScale,
        PointElement,
    );

    let labels = [
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
    ];

    export let data;
    let dataset = [];

    $: {
        dataset = {
            labels: labels,
            datasets: [
                {
                    label: "Daily behavior",
                    fill: true,
                    backgroundColor: "#248c3e",
                    data: data.slice(6,20),
                },
            ],
        };
    }
</script>

{#if dataset != []}
<div class="border" style="width:600px">
    <Line
        data={dataset}
        width={300}
        height={200}
        options={{ maintainAspectRatio: true }}
    />
</div>
{/if}