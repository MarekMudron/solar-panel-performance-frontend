<script>
    import {
        Chart,
        Title,
        Tooltip,
        Legend,
        BarElement,
        CategoryScale,
        LinearScale,
    } from "chart.js";
    import { Bar } from "svelte-chartjs";

    Chart.register(
        Title,
        Tooltip,
        Legend,
        BarElement,
        CategoryScale,
        LinearScale,
    );

    let labels = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    export let data;
    let dataset;

    $: {
        data = data.map(function (v) {
            return v/1000
        });

        dataset = {
            labels: labels,
            datasets: [
                {
                    label: "Monthly production [kW]",
                    fill: true,
                    backgroundColor: "#248c3e",
                    data: data,
                },
            ],
        };
    }
</script>

<div class="border">
    <Bar
        data={dataset}
        width={400}
        height={500}
        options={{ maintainAspectRatio: false }}
    />
</div>
