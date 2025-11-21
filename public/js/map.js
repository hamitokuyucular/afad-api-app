let map;
let baseLayer;
let source;
let vectorLayer;
let heatmapLayer;
let draw;

export function initMap() {
    baseLayer = new ol.layer.Tile({
        title: 'Base Map',
        type: 'base',
        visible: true,
        source: new ol.source.XYZ({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            attributions: 'Tiles © Esri, HERE, Garmin, OpenStreetMap'
        })
    });

    vectorLayer = new ol.layer.Vector({
        title: 'Deprem Merkez Noktaları',
        visible: true,
        source: new ol.source.Vector(),
        style: feature => {
            const mag = feature.get('magnitude'); // properties.magnitude
            const color =
                mag >= 8 ? '#7B1FA2' :
                    mag >= 7 ? '#D32F2F' :
                        mag >= 6 ? '#FF5722' :
                            mag >= 5 ? '#FF9800' :
                                mag >= 4 ? '#FFEB3B' :
                                    mag >= 3 ? '#8BC34A' :
                                        '#4CAF50';
            return new ol.style.Style({
                image: new ol.style.Circle({
                    radius: mag * 2,
                    fill: new ol.style.Fill({ color }),
                    stroke: new ol.style.Stroke({ color: '#333', width: 1 }),
                }),
            });
        }
    });

    heatmapLayer = new ol.layer.Heatmap({
        title: 'Deprem Isı Haritası',
        visible: false,
        source: new ol.source.Vector(),
        blur: 15,
        radius: 15,
        weight: f => {
            const mag = f.get('magnitude');
            return mag / 10;
        }
    });

    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Group({
                title: 'Katmanlar',
                layers: [baseLayer]
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([35, 39]),
            zoom: 6
        }),
    });

    const layerSwitcher = new ol.control.LayerSwitcher({
        reverse: false,
    });
    map.addControl(layerSwitcher);

    vectorLayer.setZIndex(10); // Üstte

}

export function updateMap(geojson) {
    const features = new ol.format.GeoJSON().readFeatures(geojson, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
    });

    if (!source) {
        source = new ol.source.Vector({
            features: features
        });
        map.addLayer(vectorLayer)
        map.addLayer(heatmapLayer)
        vectorLayer.setSource(source);
        heatmapLayer.setSource(source);

    } else {
        source.clear();
        source.addFeatures(features);
    }

    map.getView().fit(source.getExtent(), { padding: [50, 50, 50, 50] });

    const popupDOM = document.getElementById('ol-popup');
    const popupContentDOM = document.getElementById('popup-content');
    const popupCloserDOM = document.getElementById('ol-popup-closer');

    const overlay = new ol.Overlay({
        element: popupDOM,
    });
    map.addOverlay(overlay);

    popupCloserDOM.onclick = function () {
        overlay.setPosition(undefined);
        popupDOM.style.display = 'none';
        popupCloserDOM.blur();
        return false;
    };

    map.on('singleclick', function (event) {
        const feature = map.forEachFeatureAtPixel(event.pixel, (f, layer) => {
            if (layer === vectorLayer) {
                return f;
            }
        });

        if (feature) {
            const coordinates = feature.getGeometry().getCoordinates();
            const props = feature.getProperties();

            const content = `
                <strong style="display:block; text-align:center;">${props.location}</strong>
                <b>Büyüklük:</b> ${props.magnitude}<br>
                <b>Derinlik:</b> ${props.depth} km<br>
                <b>Tarih:</b> ${props.date}<br>
                <b>Ülke:</b> ${props.country || '-'}<br>
                <b>İl:</b> ${props.province || '-'}<br>
                <b>İlçe:</b> ${props.district || '-'}
            `;

            popupContentDOM.innerHTML = content;
            overlay.setPosition(coordinates);
            popupDOM.style.display = 'block';

            map.getView().animate({
                center: coordinates,
                zoom: 9,
                duration: 500,
            });
        } else {
            overlay.setPosition(undefined)
        }
    });
}

export function enableDrawRect() {
    if (draw) {
        map.removeInteraction(draw);
    }

    const drawSource = new ol.source.Vector();

    const drawLayer = new ol.layer.Vector({
        source: drawSource,
    });
    map.addLayer(drawLayer);

    draw = new ol.interaction.Draw({
        source: drawSource,
        type: "Circle", // Circle + geometryFunction ile rectangle
        geometryFunction: ol.interaction.Draw.createBox()
    });

    map.addInteraction(draw);

    draw.on("drawend", (event) => {
        const [minX, minY, maxX, maxY] = event.feature.getGeometry().getExtent();
        const [minlon, minlat] = ol.proj.toLonLat([minX, minY]);
        const [maxlon, maxlat] = ol.proj.toLonLat([maxX, maxY]);
        document.getElementById('minlat').value = minlat.toFixed(3);
        document.getElementById('maxlat').value = maxlat.toFixed(3);
        document.getElementById('minlon').value = minlon.toFixed(3);
        document.getElementById('maxlon').value = maxlon.toFixed(3);
        map.removeInteraction(draw);
    });
    document.getElementById("fetchBtn").addEventListener("click", async () => {
        drawSource.clear();
    });
}

