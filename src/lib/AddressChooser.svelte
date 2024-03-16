<script>
    import { onMount } from "svelte";
    import { API_KEY } from "../stores";
    import autoComplete  from "@tarekraafat/autocomplete.js";
    let query;
    let autoCompleteJS
let searchInput;

    onMount(() => {
        autoCompleteJS = new autoComplete({
            selector: () => searchInput,
            placeHolder: "Enter your address...",
            searchEngine: (query, record) =>
                `<mark style="color:#0a5e0d">${record}</mark>`,
            data: {
                keys: ["value"],
                src: async (query) => {
                    try {
                        const fetchData = await fetch(
                            `https://api.mapy.cz/v1/suggest?lang=cs&limit=5&type=regional.address&apikey=${$API_KEY}&query=${query}&lang=sk`,
                        );
                        const jsonData = await fetchData.json();

                        return jsonData.items.map((item) => ({
                            value: item.name,
                            data: item,
                        }));
                    } catch (exc) {
                        console.log(exc);

                        return [];
                    }
                },
                cache: false,
            },
            resultItem: {
                element: (item, data) => {
                    const itemData = data.value.data;
                    const desc = document.createElement("div");
                    item.style = "color:black";
                    desc.style =
                        "overflow: hidden; white-space: nowrap; text-overflow: ellipsis;";
                    desc.innerHTML = `${itemData.location}`;
                    item.append(desc);
                },
                highlight: true,
            },
            resultsList: {
                element: (list, data) => {
                    list.style.maxHeight = "max-content";
                    list.style.overflow = "hidden";

                    if (!data.results.length) {
                        const message = document.createElement("div");

                        message.setAttribute("class", "no_result");
                        message.style = "padding: 5px";
                        message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
                        list.prepend(message);
                    }
                },
                noResults: true,
            },
            submit: true,
        });
    });

    async function setMarker() {
        const url = new URL(`https://api.mapy.cz/v1/geocode`);
        url.searchParams.set("lang", "sk");
        url.searchParams.set("apikey", $API_KEY);
        url.searchParams.set("query", query);
        url.searchParams.set("limit", "1");
        [
            "regional.municipality",
            "regional.municipality_part",
            "regional.street",
            "regional.address",
        ].forEach((type) => url.searchParams.append("type", type));
        const response = await fetch(url.toString(), {
            mode: "cors",
        });
        const json = await response.json();
        if (json.items.length == 0) {
            return;
        }
        address = json.items[0]
        dispatch("chosen")
    }


    export let address;

    function chosen(event) {
        query = event.detail.selection.value.data.name;
        address = event.detail.selection.value.data;
        dispatch("chosen");
    }

    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();



</script>

<form method="POST" id="location-form" on:submit|preventDefault={setMarker}>
    <div class="form-group">
        <label for="address-field">Address</label>
        <input
            class="form-control"
            name="address-field"
            bind:value={query}
            id="address-field"
            autocomplete="off"
            type="search"
            bind:this={searchInput}
            on:submit={setMarker}
            on:selection={chosen}
        />
        <button
            class="btn btn-primary"
            type="submit"
            form="location-form"
            value="Submit">Find</button
        >
    </div>
</form>