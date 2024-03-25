<script>
    import AddressChooser from "$lib/AddressChooser.svelte";
    import LocationChooser from "$lib/LocationChooser.svelte";
    import Geolocation from "svelte-geolocation";
    import { currentLocation, stageInProgress, didLocationChange } from "../stores";
    import { onMount } from "svelte";

    let address;
    let addressCoords;

    let options = {
        enableHighAccuracy: true,
    };

    function addressChosen() {
        addressCoords = {lat:address.position.lat, lon:address.position.lon};
    }

    function locationChosen(e) {
        let loc = {
            lat:e.detail.lat,
            lon:e.detail.lon,
            alt:e.detail.alt,
        }
        currentLocation.set(loc);
    }

    onMount(() => {
    })

</script>

<Geolocation
    getPosition
    {options}
    on:position={(e) => {
        addressCoords = {lat:e.detail.coords.latitude ,lon:e.detail.coords.longitude}
    }}
/>

<div class=" d-flex align-items-center justify-content-center">
    <div class="row">
        <div class="col">
            <AddressChooser on:chosen={addressChosen} bind:address
            ></AddressChooser>

            <LocationChooser
                bind:inputCoords={addressCoords}
                on:chosen={locationChosen}
            ></LocationChooser>
        </div>
        <a role="button" href="/design" on:click={() => {stageInProgress.set(0);didLocationChange.set(true)}} class="btn btn-primary">Design</a>
    </div>
</div>
