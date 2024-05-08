<script>
    import AddressChooser from "$lib/AddressChooser.svelte";
    import LocationChooser from "$lib/LocationChooser.svelte";
    import Geolocation from "svelte-geolocation";
    import {
        currentLocation,
        lastModifiedStage,
        didLocationChange,
    } from "../stores";
    import { onMount } from "svelte";
    import rectangle from "$lib/assets/rectangle.jpg" 
    import NewPanelModal from "../lib/NewPanelModal.svelte";

    let address;
    let addressCoords;

    let options = {
        enableHighAccuracy: true,
    };

    function addressChosen() {
        addressCoords = {
            lat: address.position.lat,
            lon: address.position.lon,
        };
    }

    function locationChosen(e) {
        let loc = {
            lat: e.detail.lat,
            lon: e.detail.lon,
            alt: e.detail.alt,
        };
        currentLocation.set(loc);
    }
</script>

<Geolocation
    getPosition
    {options}
    on:position={(e) => {
        addressCoords = {
            lat: e.detail.coords.latitude,
            lon: e.detail.coords.longitude,
        };
    }}
/>

<div class=" d-flex align-items-center justify-content-center">
    <div class="row">
        <div class="col">
            <div class="row align-self-center m-2">
                <AddressChooser on:chosen={addressChosen} bind:address
                ></AddressChooser>
            </div>
            <div class="row align-self-center m-2">
                <LocationChooser
                    bind:inputCoords={addressCoords}
                    on:chosen={locationChosen}
                ></LocationChooser>
            </div>
            <div class="row align-self-center m-2">
                <a
                    role="button"
                    href="/design"
                    on:click={() => {
                        lastModifiedStage.set(0);
                        didLocationChange.set(true);
                    }}
                    class="btn btn-success">Design</a
                >
            </div>
        </div>
    </div>
</div>

<!-- <NewPanelModal ></NewPanelModal> -->