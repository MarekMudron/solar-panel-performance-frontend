<script>
    import AddressChooser from "$lib/AddressChooser.svelte";
    import LocationChooser from "$lib/LocationChooser.svelte";
    import Geolocation from "svelte-geolocation";
    import { currentLocation } from "../stores";

    let address;
    let addressCoords = [49, 16];

    let options = {
        enableHighAccuracy: true,
    };

    function addressChosen() {
        addressCoords = [address.position.lat, address.position.lon];
        currentLocation.set(addressCoords)
    }

    function locationChosen(e) {
        console.log("LOCSET", e.detail);
        currentLocation.set(e.detail);
    }
</script>

<Geolocation
    getPosition
    {options}
    on:position={(e) => {
        addressCoords = [e.detail.coords.latitude, e.detail.coords.longitude];
    }}
/>
<AddressChooser on:chosen={addressChosen} bind:address></AddressChooser>
<LocationChooser bind:inputCoords={addressCoords} on:chosen={locationChosen}
></LocationChooser>

<a role="button" href="/design" class="btn btn-primary">Design</a>