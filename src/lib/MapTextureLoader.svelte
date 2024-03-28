<script>
    import { onMount } from "svelte";
    import { API_KEY } from "../stores.js";
    import L from "leaflet";

    export let centerCoords = [-1, -1];
    const DIM = 2000;
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();


    function initializeMap() {
        let map = L.map("map-element");

        let mainLayer = L.tileLayer(
            `https://api.mapy.cz/v1/maptiles/aerial/256/{z}/{x}/{y}?apikey=${$API_KEY}`,
            {
                minZoom: 0,
                maxZoom: 25,
                maxNativeZoom: 19,
                className: "main-layer",
                preferCanvas: true,
                attribution:
                    '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
            },
        );
        mainLayer.addTo(map);
        map.setView(centerCoords, 19);
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
        if (map.tap) map.tap.disable();
        document.getElementById("map-element").style.cursor = "default";
        screenshot(map);
    }

    import leafletImage from "leaflet-image";

    let texture;

    function get1pxToMeters(map) {
        var centerLatLng = map.getCenter(); // get map center
        var pointC = map.latLngToContainerPoint(centerLatLng); // convert to containerpoint (pixels)
        var pointX = [pointC.x + 1, pointC.y]; // add one pixel to x

        // convert containerpoints to latlng's
        var latLngC = map.containerPointToLatLng(pointC);
        var latLngX = map.containerPointToLatLng(pointX);

        var distance = latLngC.distanceTo(latLngX);
        return distance;
    }

    export let pxToMeter;

    function screenshot(map) {
        let mapImg;
        leafletImage(map, function (err, canvas) {
            var img = document.createElement("img");
            pxToMeter = get1pxToMeters(map);
            img.width = 3000; //{DIM};
            img.height = 3000; //{DIM};
            img.src = canvas.toDataURL();
            texture = img;
            dispatch("onTextureLoaded", texture);
            //document.getElementById("map-element").remove();
        });
    }
</script>

<div
    style="visibility:hidden;height:{DIM}px; width:{DIM}px;"
    id="map-element"
    use:initializeMap
></div>
