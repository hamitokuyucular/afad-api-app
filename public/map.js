const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.XYZ({
                // url: 'https://maps.geoapify.com/v1/tile/dark-matter-dark-grey/{z}/{x}/{y}.png?apiKey=70154650509646428208df03b8616f08',
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
                attributions: 'Tiles © Esri — Sources: Esri, HERE, Garmin, (c) OpenStreetMap contributors, and the GIS user community'
            })
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([35, 39]),
        zoom: 6,
        maxZoom: 16
    }),
});
export { map };

let vectorLayer;

export function updateMap(geojson) {
    const vectorSource = new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(geojson, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
        }),
    });

    if (vectorLayer) {
        vectorLayer.setSource(vectorSource);
    } else {
        vectorLayer = new ol.layer.Vector({
            source: vectorSource,
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
            },
        });
        map.addLayer(vectorLayer);
    }

    map.getView().fit(vectorSource.getExtent(), { padding: [50, 50, 50, 50] });
};

const popupDOM = document.getElementById('popup');
const popupContentDOM = document.getElementById('popup-content');
const popupCloserDOM = document.getElementById('popup-closer');

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
        <strong>${props.location}</strong><br>
        <b>Büyüklük:</b> ${props.magnitude}<br>
        <b>Derinlik:</b> ${props.depth} km<br>
        <b>Tarih:</b> ${props.date}<br>
        <b>Ülke:</b> ${props.country}<br>
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
