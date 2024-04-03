<script>
    import { API_KEY } from "../stores.js";
    import L from "leaflet";

    let currentCoords;
    export let inputCoords = [49, 17];

    let map;
    let mainLayer;
    let labelLayer;

    let currentMarker;

    function extendCenterMarker() {
        var LiftedMarker = L.Control.extend({
            _container: null,

            onAdd: function (map) {
                var container = L.DomUtil.create("div");
                container.style.position = "absolute";
                container.style.marginLeft = 0;
                container.style.marginTop = 0;
                container.style.display = "none";

                function resize() {
                    container.style.left =
                        Math.round(map.getSize().x / 2) + "px";
                    container.style.top =
                        Math.round(map.getSize().y / 2) + "px";
                }
                resize();
                map.on("resize", resize);

                container.append(this.options.marker.getIcon().createShadow());
                container.append(this.options.marker.getIcon().createIcon());
                this._container = container;
                return this._container;
            },

            hide: function () {
                this._container.style.display = "none";
            },

            show: function () {
                this._container.style.display = "block";
            },
        });

        L.CenterMarker = L.Marker.extend({
            options: {},
            _addedToMap: false,
            _liftedMarker: null,

            initialize: function (map, options) {
                // call super
                L.Marker.prototype.initialize.call(
                    this,
                    map.getCenter(),
                    this.options,
                );
                this.addTo(map);
            },

            onAdd: function (map) {
                // super
                L.Marker.prototype.onAdd.call(this, map);

                if (!this._addedToMap) {
                    this._addedToMap = true;
                    var marker = this;
                    var map = this._map;
                    marker._liftedMarker = new LiftedMarker({
                        position: "topleft",
                        marker: marker,
                    });
                    marker._liftedMarker.addTo(map);
                    map.on("movestart", function (ev) {
                        marker._liftedMarker.show();
                        marker.hide();
                    });
                    map.on("moveend", function (ev) {
                        marker.setLatLng(map.getCenter());
                        marker.show();
                        marker._liftedMarker.hide();
                        marker.fire("newposition");
                    });
                }
            },

            hide: function () {
                this._icon.style.display = "none";
                this._shadow.style.display = "none";
            },

            show: function () {
                this._icon.style.display = "block";
                this._shadow.style.display = "block";
            },
        });

        L.centerMarker = function (latlng, options) {
            return new L.CenterMarker(latlng, options);
        };
    }

    function initializeMap() {
        extendCenterMarker();
        map = L.map("map-element", {
            debounceMoveend: false
        });

        mainLayer = L.tileLayer(
            `https://api.mapy.cz/v1/maptiles/aerial/256/{z}/{x}/{y}?apikey=${$API_KEY}`,
            {
                minZoom: 0,
                maxZoom: 19,
                className: "main-layer",
                preferCanvas: true,
                attribution:
                    '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
            },
        );
        mainLayer.addTo(map);
        labelLayer = L.tileLayer(
            `https://api.mapy.cz/v1/maptiles/names-overlay/256/{z}/{x}/{y}?apikey=${$API_KEY}`,
            {
                minZoom: 0,
                maxZoom: 19,
                attribution:
                    '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
            },
        );
        labelLayer.addTo(map);

        map.setView(inputCoords, 17);
        currentMarker = L.centerMarker(map);
        map.on("dragend", function (e) {
            setCursorPosition();
        });
    }

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    async function getAltitude(lon, lat) {
        return fetch(
            `https://api.mapy.cz/v1/elevation?lang=cs&positions=${lon}%2C${lat}&apikey=${$API_KEY}`,
        )
            .then((response) => response.json())
            .then((data) => {
                // Získání výšky z odpovědi API
                return data.items[0].elevation;
            });
    }

    async function setCursorPosition() {
        let c = map.getCenter();
        currentCoords = { lat: c.lat, lon: c.lng };
        currentCoords.alt = await getAltitude(currentCoords.lon, currentCoords.lat);
        dispatch("chosen", currentCoords);
    }

    function changeInputPos() {
        map.setView(inputCoords, 17);
        setCursorPosition();
    }

    $: {
        inputCoords;
        if (map) changeInputPos();
    }
</script>

<div
    style="height:600px; width:1000px;"
    id="map-element"
    use:initializeMap
><h1>Map</h1></div>
